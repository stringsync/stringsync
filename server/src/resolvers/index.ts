import { MergeInfo } from 'apollo-server';
import { ServerContext } from '../util/getServerContext';
import { GraphQLResolveInfo } from 'graphql';
import { IResolvers } from 'apollo-server';
import { notations } from './user/notations';
import { login } from './query/login';
import { refreshAuth } from './query/refreshAuth';
import { getUsers } from './query/getUsers';
import { getUser } from './query/getUser';
import { signup } from './mutation/signup';

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

export const resolvers: IResolvers = {
  // Scalars

  // Types
  User: {
    notations,
  },
  // Query
  Query: {
    login,
    refreshAuth,
    getUsers,
    getUser,
  },
  // Mutation
  Mutation: {
    signup,
  },
};
