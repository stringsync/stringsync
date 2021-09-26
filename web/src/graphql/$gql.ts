import { isObject, isString, isUndefined } from 'lodash';
import { CompiledResult, mutation, params, query, QueryObject, rawString } from 'typed-graphqlify';
import { Params } from 'typed-graphqlify/dist/render';
import { ukeyof } from '../util/types';
import { Mutation, Query } from './graphqlTypes';
import { Path } from './Path';

type Field = Exclude<ukeyof<Mutation | Query>, '__typename'>;

type Compiler = typeof query | typeof mutation;

type Variables = {
  [key: string]: Prim | Variables | Variables[];
};

type Prim = string | boolean | number | null;

type Data<T extends CompiledResult<any, any> | void> = T extends CompiledResult<any, any> ? T['data'] : T;

export class Gql<R extends CompiledResult<any, any>, V extends CompiledResult<any, any> | void> {
  static make<QR, QV>(
    compiler: Compiler,
    field: Field,
    queryObject: QR,
    variablesObject?: QV | undefined,
    enumPaths = new Array<Path>()
  ) {
    const queryResult = compiler(queryObject);
    const variablesResult = variablesObject && query(variablesObject);
    return new Gql(compiler, field, queryObject, enumPaths, queryResult, variablesResult);
  }

  private constructor(
    public readonly compiler: Compiler,
    public readonly field: Field,
    public readonly queryObject: QueryObject,
    public readonly enumPaths: Path[],
    public readonly queryResult: R,
    public readonly variablesResult?: V
  ) {}

  toString(variables: Data<V>): string {
    const result = isUndefined(variables)
      ? this.queryResult
      : this.compiler({ [this.field]: params(this.graphqlify(variables), this.queryObject) });
    return result.toString();
  }

  private graphqlify(variables: Variables, path = Path.create()): Params {
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
