import { GraphQLCtx } from '../util/ctx';
import { GraphQLResolveInfo } from 'graphql';

export type Resolver<R, P = undefined, A = undefined> = (
  parent: P,
  args: A,
  ctx: GraphQLCtx,
  info: GraphQLResolveInfo
) => R;
