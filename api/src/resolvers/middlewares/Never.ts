import { MiddlewareFn } from 'type-graphql';
import { BadRequestError } from '../../errors';

export const Never: MiddlewareFn = async (data, next): Promise<never> => {
  throw new BadRequestError('invalid request');
};
