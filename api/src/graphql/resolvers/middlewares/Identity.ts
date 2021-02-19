import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../types';

export const Identity: MiddlewareFn<ReqCtx> = async (data, next) => next();
