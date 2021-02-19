import { MiddlewareFn } from 'type-graphql';

type ErrorHandler = (err: Error) => any;

export const WithErrorHandler = (errorHandler: ErrorHandler): MiddlewareFn => async (data, next) => {
  try {
    await next();
  } catch (err) {
    return await errorHandler(err);
  }
};
