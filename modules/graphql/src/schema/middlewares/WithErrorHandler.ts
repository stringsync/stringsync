import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../types';

type ErrorHandler = (err: Error) => any;

export const WithErrorHandler = (errorHandler: ErrorHandler): MiddlewareFn<ResolverCtx> => async (data, next) => {
  try {
    await next();
  } catch (err) {
    return await errorHandler(err);
  }
};
