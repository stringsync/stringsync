import { isObject, isString } from 'lodash';
import { CompiledResult, mutation, params, query, rawString } from 'typed-graphqlify';
import { Params } from 'typed-graphqlify/dist/render';
import { Mutation, Query } from './graphqlTypes';
import { Path } from './Path';

type Root = Query | Mutation;
type Fields<T extends Root> = Exclude<keyof T, '__typename'>;
type Compiler = typeof query | typeof mutation;
type Variables = { [key: string]: Prim | Variables | Variables[] };
type Prim = string | boolean | number | null;

export class Gql<Q, V> {
  static query<F extends Fields<Query>>(field: F) {
    return new GqlBuilder<Query, F>(query, field, undefined, [], undefined);
  }

  static mutation<F extends Fields<Mutation>>(field: F) {
    return new GqlBuilder<Mutation, F>(query, field, undefined, [], undefined);
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
    return new Gql<Q, V>(compiler, field, queryObject, enumPaths, queryResult);
  };

  constructor(
    public readonly compiler: Compiler,
    public readonly field: string | symbol | number,
    public readonly queryObject: Q,
    public readonly enumPaths: Path[],
    public readonly queryResult: CompiledResult<Q, any>
  ) {}

  toString(variables: V): string {
    const result = isObject(variables)
      ? this.compiler({ [this.field]: params(this.graphqlify(variables), this.queryObject) })
      : this.queryResult;
    return result.toString();
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
  Q extends Partial<T[F]> | void = void,
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

  setQueryObject<_Q extends Partial<T[F]>>(queryObject: _Q) {
    return new GqlBuilder<T, F, _Q, V>(this.compiler, this.field, queryObject, this.enumPaths, this.variablesObject);
  }

  setEnumPaths(enumPaths: Path[]) {
    return new GqlBuilder<T, F, Q, V>(this.compiler, this.field, this.queryObject, enumPaths, this.variablesObject);
  }

  setVariablesObject<_V extends Record<string, any>>(variablesObject: _V) {
    return new GqlBuilder<T, F, Q, _V>(this.compiler, this.field, this.queryObject, this.enumPaths, variablesObject);
  }
}
