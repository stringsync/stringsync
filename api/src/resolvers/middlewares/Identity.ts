import { MiddlewareFn } from 'type-graphql';

export const Identity: MiddlewareFn = async (data, next) => next();
