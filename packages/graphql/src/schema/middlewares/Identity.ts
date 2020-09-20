import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../ctx';

export const Identity: MiddlewareFn<ReqCtx> = async (data, next) => next();
