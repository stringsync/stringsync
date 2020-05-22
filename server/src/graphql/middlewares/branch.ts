import { Middleware, Predicate } from './types';
import { identity } from './identity';

export const branch = <S, C, A>(
  test: Predicate<S, C, A>,
  left: Middleware<S, C, A>,
  right: Middleware<S, C, A> = identity
): Middleware<S, C, A> => (next) => async (src, args, ctx, info) => {
  const result = await test(src, args, ctx, info);
  const resolver = result ? left(next) : right(next);
  return resolver(src, args, ctx, info);
};
