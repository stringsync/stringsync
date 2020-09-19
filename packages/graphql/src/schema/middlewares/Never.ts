import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../types';
import { BadRequestError } from '@stringsync/common';

export const Never: MiddlewareFn<ResolverCtx> = async (data, next): Promise<never> => {
  throw new BadRequestError('invalid request');
};
