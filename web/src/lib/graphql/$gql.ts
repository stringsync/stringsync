import { extractFiles } from 'extract-files';
import { GraphQLError } from 'graphql';
import { cloneDeep, isObject, isString, isUndefined, toPath } from 'lodash';
import { mutation, onUnion, params, query, rawString } from 'typed-graphqlify';
import { Params } from 'typed-graphqlify/dist/render';
import { GRAPHQL_URI } from '.';
import { OnlyKey } from '../../util/types';
import { UnknownError } from '../errors';
import { Mutation, Query } from './graphqlTypes';
import * as helpers from './helpers';
import { ObjectPath } from './ObjectPath';
import { t } from './t';
import { StrictSelection } from './types';

export type Root = Query | Mutation;
export type Fields<T extends Root> = keyof T;
export type Compiler = typeof query | typeof mutation;
type MaybeNullable<T> = T extends any[] ? T : T | null;

export type Any$gql = $gql<any, any, any, any>;
export type RootOf<G extends Any$gql> = G extends $gql<infer T, any, any, any> ? T : never;
export type FieldOf<G extends Any$gql> = G extends $gql<any, infer F, any, any> ? F : never;
export type DataOf<G extends Any$gql> = G extends $gql<any, any, infer Q, any> ? MaybeNullable<Q> : never;
export type VariablesOf<G extends Any$gql> = G extends $gql<any, any, any, infer V> ? V : never;

export type SuccessfulResponse<G extends Any$gql> = { data: OnlyKey<FieldOf<G>, DataOf<G>>; errors?: never };
export type FailedResponse = { data: null; errors: GraphQLError[] };
export type GqlResponseOf<G extends Any$gql> = SuccessfulResponse<G> | FailedResponse;

type VariableNameLookup = Record<string, string>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class $gql<T extends Root, F extends Fields<T>, Q, V> {
  static t = t;
  static union = onUnion;

  static query<F extends Fields<Query>>(field: F) {
    return new GqlBuilder<Query, F>(query, field, undefined, undefined);
  }

  static mutation<F extends Fields<Mutation>>(field: F) {
    return new GqlBuilder<Mutation, F>(mutation, field, undefined, undefined);
  }

  static async toGqlResponse<G extends Any$gql>(res: Response): Promise<GqlResponseOf<G>> {
    const contentType = res.headers.get('content-type');
    if (!contentType?.toLowerCase().includes('application/json')) {
      console.warn(`unexpected content-type, got: ${contentType}`);
      throw new UnknownError();
    }

    const json = await res.json();
    if (!$gql.isGqlResponse<G>(json)) {
      console.warn('unexpected graphql response from server');
      throw new UnknownError();
    }

    return json;
  }

  private static isGqlResponse = <G extends Any$gql>(value: any): value is GqlResponseOf<G> => {
    return isObject(value) && 'data' in value;
  };

  public readonly compiler: Compiler;
  public readonly field: F;
  public readonly query: Q;
  public readonly variables: V;

  constructor(compiler: Compiler, field: F, query: Q, variables: V) {
    this.compiler = compiler;
    this.field = field;
    this.query = query;
    this.variables = variables;
  }

  async fetch(variables: V, abortSignal?: AbortSignal): Promise<GqlResponseOf<this>> {
    const res = await fetch(GRAPHQL_URI, this.toRequestInit(variables, abortSignal));
    return await $gql.toGqlResponse(res);
  }

  toString(variables: V): string {
    const lookup = this.createVariableNameLookup(variables);

    const uploadVariableNames = Object.values(lookup);
    const name =
      uploadVariableNames.length > 0
        ? `${this.field.toString()}(${uploadVariableNames
            .map((variableName) => `$${variableName}: Upload!`)
            .join(', ')})`
        : this.field.toString();

    if (isObject(variables)) {
      return this.compiler(name, { [this.field]: params(this.graphqlify(variables, lookup), this.query) }).toString();
    } else {
      return this.compiler(name, { [this.field]: this.query }).toString();
    }
  }

  toRequestInit(variables: V, abortSignal?: AbortSignal): RequestInit {
    return {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: this.toFormData(variables),
      credentials: 'include',
      mode: 'cors',
      signal: abortSignal,
    };
  }

  toFormData(variables: V): FormData {
    const lookup = this.createVariableNameLookup(variables);

    // extract files
    const extraction = extractFiles<File>(
      { query: this.toString(variables), variables },
      undefined,
      (value: any): value is File => value instanceof File
    );
    const clone = extraction.clone;
    const fileMap = extraction.files;

    // compute map
    const map: { [key: string]: string | string[] } = {};
    const pathGroups = Array.from(fileMap.values());
    for (let ndx = 0; ndx < pathGroups.length; ndx++) {
      const paths = pathGroups[ndx];
      map[ndx] = paths.map((path) => {
        const [first, ...rest] = toPath(path);
        const key = ObjectPath.create(...rest).toString();
        return key in lookup ? `${first}.${lookup[key]}` : path;
      });
    }

    // create form data
    const formData = new FormData();
    formData.append('operations', JSON.stringify(clone));
    formData.append('map', JSON.stringify(map));

    // append files to form data
    const files = Array.from(fileMap.keys());
    for (let ndx = 0; ndx < files.length; ndx++) {
      const file = files[ndx];
      formData.append(ndx.toString(), file, `@${file.name}`);
    }

    return formData;
  }

  private createVariableNameLookup(variables: V) {
    const lookup: Record<string, string> = {};

    if (isUndefined(variables)) {
      return lookup;
    }

    let id = 0;

    helpers.forEachEntry(variables, (entry, truePath) => {
      if (entry instanceof File) {
        lookup[truePath.toString()] = `upload${id++}`;
      }
    });

    return lookup;
  }

  private graphqlify(variables: V, lookup: VariableNameLookup) {
    const params: Params = {};

    helpers.forEachEntry(variables, (entry, truePath, schemaPath) => {
      if (isString(entry) && !this.isEnum(schemaPath)) {
        truePath.set(params, rawString(entry));
      } else if (entry instanceof File) {
        const variableName = lookup[truePath.toString()];
        truePath.set(params, variableName ? `$${variableName}` : null);
      } else if (Array.isArray(entry)) {
        truePath.set(params, []);
      } else if (isObject(entry)) {
        truePath.set(params, {});
      } else {
        truePath.set(params, entry);
      }
    });

    return params;
  }

  private isEnum(path: ObjectPath): boolean {
    const t = path.get(this.variables);
    const meta = helpers.getMeta(t);
    return !!meta && !!meta.isEnum;
  }
}

class GqlBuilder<
  T extends Root,
  F extends Fields<T>,
  Q extends StrictSelection<T[F]> | void = void,
  V extends Record<string, any> | void = void
> {
  private compiler: Compiler;
  private field: F;
  private query: Q;
  private variables: V;

  constructor(compiler: Compiler, field: F, query: Q, variables: V) {
    this.compiler = compiler;
    this.field = field;
    this.query = query;
    this.variables = variables;
  }

  setQuery<_Q extends StrictSelection<T[F]>>(query: _Q) {
    return new GqlBuilder<T, F, _Q, V>(this.compiler, this.field, query, this.variables);
  }

  setVariables<_V extends Record<string, any>>(variables: _V) {
    return new GqlBuilder<T, F, Q, _V>(this.compiler, this.field, this.query, variables);
  }

  build() {
    // validate query
    if (!this.query) {
      throw new Error(`must set query before building`);
    }
    this.compiler(this.query);

    // validate variables
    if (this.variables) {
      this.compiler(this.variables);
    }

    // For some reason, if we don't create new objects, some queries will be inexplicably "linked" to
    // each other causing unwanted mutations to the query object.
    return new $gql<T, F, Q, V>(this.compiler, this.field, cloneDeep(this.query), cloneDeep(this.variables));
  }
}
