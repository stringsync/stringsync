import { BadRequestError } from '@stringsync/common';
import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../ctx';

export const Never: MiddlewareFn<ReqCtx> = async (data, next): Promise<never> => {
  throw new BadRequestError('invalid request');
};
