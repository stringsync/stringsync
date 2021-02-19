import { MiddlewareFn } from 'type-graphql';
import { Predicate } from './types';

export const Branch = (test: Predicate, left: MiddlewareFn, right: MiddlewareFn): MiddlewareFn => async (
  data,
  next
): Promise<any> => {
  const result = await test(data, next);
  const middleware = result ? left : right;
  return middleware(data, next);
};
