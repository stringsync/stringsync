import { MiddlewareFn } from 'type-graphql';
import { Predicate } from './types';

export const Branch = <T>(test: Predicate<T>, left: MiddlewareFn<T>, right: MiddlewareFn<T>): MiddlewareFn<T> => async (
  data,
  next
): Promise<any> => {
  const result = await test(data, next);
  const middleware = result ? left : right;
  return middleware(data, next);
};
