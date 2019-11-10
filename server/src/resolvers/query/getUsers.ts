import { FieldResolver } from '..';
import { User } from 'common/types';
import { guardAuthenticated } from '../../guards';

export const getUsers: FieldResolver<User[]> = async (parent, args, ctx) => {
  guardAuthenticated(ctx);
  return await ctx.db.models.User.findAll();
};
