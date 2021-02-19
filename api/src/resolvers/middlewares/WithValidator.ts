import { MiddlewareFn } from 'type-graphql';
import { Validator } from './types';

export const WithValidator = (validator: Validator): MiddlewareFn => async (data, next) => {
  await validator(data);
  return next();
};
