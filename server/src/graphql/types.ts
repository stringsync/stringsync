import { IGraphQLToolsResolveInfo } from 'graphql-tools';
import { ResolverCtx } from '../util/ctx';

export type Resolver<
  R = any,
  S = undefined,
  A = Record<string, any>,
  C = ResolverCtx
> = (src: S, args: A, rctx: C, info: IGraphQLToolsResolveInfo) => R;
