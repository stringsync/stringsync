import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../types';
import { Predicate } from './types';

export const Branch = (
  test: Predicate<ResolverCtx>,
  left: MiddlewareFn<ResolverCtx>,
  right: MiddlewareFn<ResolverCtx>
): MiddlewareFn<ResolverCtx> => async (data, next): Promise<any> => {
  const result = await test(data, next);
  const middleware = result ? left : right;
  return middleware(data, next);
};
