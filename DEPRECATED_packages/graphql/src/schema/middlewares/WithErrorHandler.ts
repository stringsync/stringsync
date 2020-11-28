import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../ctx';

type ErrorHandler = (err: Error) => any;

export const WithErrorHandler = (errorHandler: ErrorHandler): MiddlewareFn<ReqCtx> => async (data, next) => {
  try {
    await next();
  } catch (err) {
    return await errorHandler(err);
  }
};
