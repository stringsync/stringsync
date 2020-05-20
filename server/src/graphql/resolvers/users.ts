import { toCanonicalUser } from '../../data/db';
import { User } from '../../common';
import { IFieldResolver } from 'graphql-tools';
import { GraphQLCtx } from '../../util/ctx';

type UsersResolver = IFieldResolver<undefined, GraphQLCtx, {}>;

export const users: UsersResolver = async (src, args, ctx): Promise<User[]> => {
  const userModels = await ctx.db.models.User.findAll();
  return userModels.map(toCanonicalUser);
};
