import { MiddlewareFn } from 'type-graphql';
import { Validator } from './types';

export const WithValidator = <T>(validator: Validator<T>): MiddlewareFn<T> => async (data, next) => {
  await validator(data);
  return next();
};
