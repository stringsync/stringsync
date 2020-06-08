import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../types';

export const Identity: MiddlewareFn<ResolverCtx> = async (data, next) => next();
