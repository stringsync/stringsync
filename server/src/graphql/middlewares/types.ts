import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';

export type Middleware<
  Resolver extends IFieldResolver<any, any> = IFieldResolver<any, ResolverCtx>
> = (next: Resolver) => Resolver;
