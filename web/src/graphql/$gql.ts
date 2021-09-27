import { extractFiles } from 'extract-files';
import { GraphQLError } from 'graphql';
import { isObject, isString } from 'lodash';
import { CompiledResult, mutation, params, query, rawString, types } from 'typed-graphqlify';
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

export type GraphqlResponseOf<G extends AnyGql> = GraphqlResponse<G>;

export class Gql<T extends Root, F extends Fields<T>, Q, V> {
  static query<F extends Fields<Query>>(field: F) {
    return new GqlBuilder<Query, F>(query, field, undefined, [], undefined);
  }

  static mutation<F extends Fields<Mutation>>(field: F) {
    return new GqlBuilder<Mutation, F>(mutation, field, undefined, [], undefined);
  }

  static make = <T extends Root, F extends Fields<T>, Q, V>(
    compiler: Compiler,
    field: F,
    queryObject: Q,
    enumPaths = new Array<Path>(),
    variablesObject: V
  ) => {
    if (!queryObject) {
      throw new Error('fuck');
    }
    const queryResult = compiler(queryObject);
    return new Gql<T, F, Q, V>(compiler, field, queryObject, enumPaths, queryResult);
  };

  static string = types.string;
  static number = types.number;
  static boolean = types.boolean;
  static oneOf = types.oneOf;
  static optional = types.optional;
  static custom = types.custom;

  constructor(
    private readonly compiler: Compiler,
    private readonly field: string | symbol | number,
    private readonly queryObject: Q,
    private readonly enumPaths: Path[],
    private readonly queryResult: CompiledResult<Q, any>
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

  private isEnum(path: Path) {
    return this.enumPaths.some((enumPath) => enumPath.match(path));
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
  private enumPaths = new Array<Path>();
  private variablesObject: V;

  constructor(compiler: Compiler, field: F, queryObject: Q, enumPaths: Path[], variablesObject: V) {
    this.compiler = compiler;
    this.field = field;
    this.queryObject = queryObject;
    this.enumPaths = enumPaths;
    this.variablesObject = variablesObject;
  }

  build() {
    if (!this.queryObject) {
      throw new Error(`cannot build without a queryObject`);
    }
    return Gql.make<T, F, Q, V>(this.compiler, this.field, this.queryObject, this.enumPaths, this.variablesObject);
  }

  setQuery<_Q extends DeepPartial<T[F]>>(queryObject: _Q) {
    return new GqlBuilder<T, F, _Q, V>(this.compiler, this.field, queryObject, this.enumPaths, this.variablesObject);
  }

  setEnumPaths(enumPaths: Path[]) {
    return new GqlBuilder<T, F, Q, V>(this.compiler, this.field, this.queryObject, enumPaths, this.variablesObject);
  }

  setVariables<_V extends Record<string, any>>(variablesObject: _V) {
    return new GqlBuilder<T, F, Q, _V>(this.compiler, this.field, this.queryObject, this.enumPaths, variablesObject);
  }
}
