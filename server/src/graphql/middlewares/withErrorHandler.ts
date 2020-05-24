import { Middleware } from './types';

type ErrorHandler = (err: Error) => any;

export const withErrorHandler = (
  errorHandler: ErrorHandler
): Middleware<any, any, any> => (next) => async (src, args, rctx, info) => {
  try {
    return await next(src, args, rctx, info);
  } catch (err) {
    return await errorHandler(err);
  }
};
