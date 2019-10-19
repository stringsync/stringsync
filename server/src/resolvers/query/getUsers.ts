import { FieldResolver } from '..';
import { User } from 'common/types';

export const getUsers: FieldResolver<User[]> = async (parent, args, ctx) => {
  // if (!ctx.auth.isLoggedIn) {
  //   throw new AuthenticationError('must be logged in');
  // }
  return await ctx.db.models.User.findAll({ raw: true });
};
