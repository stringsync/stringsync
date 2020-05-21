import { toCanonicalUser } from '../../data/db';
import { User, UsersInput } from '../../common';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../util/ctx';

type UsersResolver = IFieldResolver<
  undefined,
  ResolverCtx,
  { input: UsersInput }
>;

export const users: UsersResolver = async (src, args, ctx): Promise<User[]> => {
  const users = await ctx.db.models.User.findAll();
  return users.map(toCanonicalUser);
};
