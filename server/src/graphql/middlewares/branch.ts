import { GraphQLResolveInfo } from 'graphql';
import { Middleware } from './types';
import { identity } from './identity';

export const branch = (
  test: <S, A, C>(
    src: S,
    args: A,
    ctx: C,
    info: GraphQLResolveInfo
  ) => Promise<boolean> | boolean,
  left: Middleware,
  right: Middleware = identity
): Middleware => (next) => async (src, args, ctx, info) => {
  const result = await test(src, args, ctx, info);
  return result ? left(next) : right(next);
};
