import { Middleware } from './types';

type ErrorHandler = (err: Error) => any;

export const withErrorHandler = (errorHandler: ErrorHandler): Middleware => (
  next
) => async (src, args, ctx, info) => {
  try {
    return await next(src, args, ctx, info);
  } catch (err) {
    return await errorHandler(err);
  }
};
