import { MiddlewareFn, ResolverData } from 'type-graphql';

export const Identity = (middleware: MiddlewareFn<ResolverData>): MiddlewareFn<ResolverData> => middleware;
