import { MiddlewareFn } from 'type-graphql';
import { BadRequestError } from '../../../errors';
import { ReqCtx } from '../../types';

export const Never: MiddlewareFn<ReqCtx> = async (data, next): Promise<never> => {
  throw new BadRequestError('invalid request');
};
