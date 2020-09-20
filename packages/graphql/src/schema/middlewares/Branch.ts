import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../ctx';
import { Predicate } from './types';

export const Branch = (
  test: Predicate<ReqCtx>,
  left: MiddlewareFn<ReqCtx>,
  right: MiddlewareFn<ReqCtx>
): MiddlewareFn<ReqCtx> => async (data, next): Promise<any> => {
  const result = await test(data, next);
  const middleware = result ? left : right;
  return middleware(data, next);
};
