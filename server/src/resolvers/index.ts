import { getUser } from './query/getUser';
import { getUsers } from './query/getUsers';
import { GraphQLResolveInfo } from 'graphql';
import { IResolvers } from 'apollo-server';
import { login } from './mutation/login';
import { MergeInfo } from 'apollo-server';
import { notations } from './user/notations';
import { logout } from './mutation/logout';
import { reauth } from './mutation/reauth';
import { ServerContext } from '../util/createServerContext';
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
    getUsers,
    getUser,
  },
  // Mutation
  Mutation: {
    login,
    logout,
    signup,
    reauth,
  },
};
