import { MergeInfo } from 'apollo-server';
import { ServerContext } from '../util/getServerContext';
import { GraphQLResolveInfo } from 'graphql';

// Rewrite of Apollo's IFieldResolver to enforce a certain result
export type FieldResolver<
  TResult,
  TSource = undefined,
  TArgs = Record<string, any>
> = (
  parent: TSource,
  args: TArgs,
  context: ServerContext,
  info: GraphQLResolveInfo & { mergeInfo: MergeInfo }
) => TResult | Promise<TResult>;
