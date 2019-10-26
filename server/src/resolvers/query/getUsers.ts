import { FieldResolver } from '..';
import { User } from 'common/types';

export const getUsers: FieldResolver<User[]> = async (parent, args, ctx) => {
  return await ctx.db.models.User.findAll();
};
