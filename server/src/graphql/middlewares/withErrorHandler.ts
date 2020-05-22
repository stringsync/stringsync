import { Middleware } from './types';

type ErrorHandler = (err: Error) => any;

export const withErrorHandler = (errorHandler: ErrorHandler): Middleware => (
  next
) => (src, args, ctx, info) => {
  try {
    next(src, args, ctx, info);
  } catch (err) {
    errorHandler(err);
  }
};
