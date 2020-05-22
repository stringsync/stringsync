import { IFieldResolver, IGraphQLToolsResolveInfo } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';

export type Middleware<
  S = undefined,
  C = ResolverCtx,
  A = Record<string, any>
> = (next: IFieldResolver<S, C, A>) => IFieldResolver<S, C, A>;

export type Predicate<
  S = undefined,
  C = ResolverCtx,
  A = Record<string, any>
> = (
  src: S,
  args: A,
  ctx: C,
  info: IGraphQLToolsResolveInfo
) => Promise<boolean> | boolean;
