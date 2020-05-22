import { GraphQLResolveInfo } from 'graphql';
import { Middleware } from './types';
import { identity } from './identity';

export const branch = (
  test: (
    src: any,
    args: any,
    ctx: any,
    info: GraphQLResolveInfo
  ) => Promise<boolean> | boolean,
  left: Middleware,
  right: Middleware = identity
): Middleware => (next) => async (src, args, ctx, info) => {
  const result = await test(src, args, ctx, info);
  const resolver = result ? left(next) : right(next);
  return resolver(src, args, ctx, info);
};
