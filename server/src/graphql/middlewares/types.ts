import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';

export type Middleware<
  R extends IFieldResolver<any, any> = IFieldResolver<any, ResolverCtx>
> = (next: R) => R;
