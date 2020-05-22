import { Middleware, Predicate } from './types';
import { identity } from './identity';

export const branch = <R, S, A, C>(
  test: Predicate<S, A, C>,
  left: Middleware<Promise<R>, S, A, C>,
  right: Middleware<Promise<R>, S, A, C> = identity
): Middleware<Promise<R>, S, A, C> => (next) => async (
  src,
  args,
  ctx,
  info
) => {
  const result = await test(src, args, ctx, info);
  const resolver = result ? left(next) : right(next);
  return resolver(src, args, ctx, info);
};
