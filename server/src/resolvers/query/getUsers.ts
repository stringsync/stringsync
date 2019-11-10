import { FieldResolver } from '..';
import { User } from 'common/types';
import { authenticated } from '../../guards/authenticated';

const getUsersResolver: FieldResolver<User[]> = async (parent, args, ctx) => {
  return await ctx.db.models.User.findAll();
};

export const getUsers = authenticated(getUsersResolver);
