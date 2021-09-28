import { extractFiles } from 'extract-files';
import { GraphQLError } from 'graphql';
import { isObject, isPlainObject, isString } from 'lodash';
import { mutation, params, query, rawString, types } from 'typed-graphqlify';
import { Params } from 'typed-graphqlify/dist/render';
import { DeepPartial, OnlyKey } from '../util/types';
import { Mutation, Query } from './graphqlTypes';
import { Path } from './Path';

type Root = Query | Mutation;
type Fields<T extends Root> = keyof T;
type Compiler = typeof query | typeof mutation;
type Variables = { [key: string]: Prim | Variables | Variables[] };
type Prim = string | boolean | number | null;
export type AnyGql = Gql<any, any, any, any>;
type FieldOf<T extends AnyGql> = T extends Gql<any, infer F, any, any> ? F : never;
export type DataOf<T extends AnyGql> = T extends Gql<any, any, infer Q, any> ? Q : never;
export type VariablesOf<T extends AnyGql> = T extends Gql<any, any, any, infer V> ? V : never;
type SuccessfulResponse<G extends AnyGql> = { data: OnlyKey<FieldOf<G>, DataOf<G>>; errors?: never };
type FailedResponse = { data: null; errors: GraphQLError[] };
type GraphqlResponse<G extends AnyGql> = SuccessfulResponse<G> | FailedResponse;
type ValueOf<T> = T[keyof T];
type Meta = { isEnum?: boolean };

export type GraphqlResponseOf<G extends AnyGql> = GraphqlResponse<G>;

const META_KEY = Symbol('meta');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Gql<T extends Root, F extends Fields<T>, Q, V> {
  static query<F extends Fields<Query>>(field: F) {
    return new GqlBuilder<Query, F>(query, field, undefined, undefined);
  }

  static mutation<F extends Fields<Mutation>>(field: F) {
    return new GqlBuilder<Mutation, F>(mutation, field, undefined, undefined);
  }

  private static injectMeta(object: any, meta: Meta) {
    if (!isPlainObject(object)) {
      throw new Error(`can only inject metadata into plain objects, got: ${object}`);
    }
    object[META_KEY] = meta;
    return object;
  }

  private static getMeta(object: any): Meta | undefined {
    if (!isPlainObject(object)) {
      return undefined;
    }
    return object[META_KEY];
  }

  static string = types.string;
  static number = types.number;
  static boolean = types.boolean;
  static oneOf = <T extends {}>(enumerable: T): ValueOf<T> | keyof T => {
    const t = types.oneOf(enumerable);
    // This only works because t is actually a lie:
    // https://github.com/acro5piano/typed-graphqlify/blob/4b9d6d2bd1466dc3e503b1220a20abf8f554133c/src/types.ts#L50
    // If typed-graphqlify changes this, the metadata will have to be attached some other way.
    Gql.injectMeta(t, { isEnum: true });
    return t;
  };
  static custom = types.custom;
  static optional: {
    number?: number;
    string?: string;
    boolean?: boolean;
    oneOf: <T extends {}>(_e: T) => ValueOf<T> | undefined;
    custom: <T>() => T | undefined;
  } = Gql as any;

  constructor(
    private readonly compiler: Compiler,
    private readonly field: string | symbol | number,
    private readonly queryObject: Q,
    private readonly variablesObject: V
  ) {}

  toString(variables: V): string {
    const result = isObject(variables)
      ? this.compiler({ [this.field]: params(this.graphqlify(variables), this.queryObject) })
      : this.compiler({ [this.field]: this.queryObject });
    return result.toString();
  }

  toFormData(variables: V): FormData {
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
      map[ndx] = paths;
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

  private graphqlify(variables: Record<any, any>, path = Path.create()): Params {
    const params: Params = {};

    for (const [key, value] of Object.entries(variables)) {
      const inner = (value: Prim | Variables | Variables[], innerPath: Path): any => {
        if (isString(value) && !this.isEnum(innerPath)) {
          return rawString(value);
        } else if (Array.isArray(value)) {
          return value.map((el) => inner(el, innerPath.add(Path.STAR)));
        } else if (isObject(value)) {
          return this.graphqlify(value, innerPath);
        } else {
          return value;
        }
      };
      params[key] = inner(value, path.add(key));
    }

    return params;
  }

  private isEnum(path: Path): boolean {
    const t = path.get(this.variablesObject);
    const meta = Gql.getMeta(t);
    return !!meta && !!meta.isEnum;
  }
}

class GqlBuilder<
  T extends Root,
  F extends Fields<T>,
  Q extends DeepPartial<T[F]> | void = void,
  V extends Record<string, any> | void = void
> {
  private compiler: Compiler;
  private field: F;
  private queryObject: Q;
  private variablesObject: V;

  constructor(compiler: Compiler, field: F, queryObject: Q, variablesObject: V) {
    this.compiler = compiler;
    this.field = field;
    this.queryObject = queryObject;
    this.variablesObject = variablesObject;
  }

  build() {
    if (!this.queryObject) {
      throw new Error(`cannot build without a queryObject`);
    }
    return new Gql<T, F, Q, V>(this.compiler, this.field, this.queryObject, this.variablesObject);
  }

  setQuery<_Q extends DeepPartial<T[F]>>(queryObject: _Q) {
    return new GqlBuilder<T, F, _Q, V>(this.compiler, this.field, queryObject, this.variablesObject);
  }

  setVariables<_V extends Record<string, any>>(variablesObject: _V) {
    return new GqlBuilder<T, F, Q, _V>(this.compiler, this.field, this.queryObject, variablesObject);
  }
}
