import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../ctx';
import { Validator } from './types';

export const WithValidator = (validator: Validator<ReqCtx>): MiddlewareFn<ReqCtx> => async (data, next) => {
  await validator(data);
  return next();
};
