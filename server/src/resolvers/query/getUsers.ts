import { FieldResolver } from '..';
import { User } from 'common/types';
import { asUserPojo } from '../../db/casters/user/asUserPojo';

export const getUsers: FieldResolver<User[]> = async (parent, args, ctx) => {
  // if (!ctx.auth.isLoggedIn) {
  //   throw new AuthenticationError('must be logged in');
  // }
  return await ctx.db.models.User.findAll({ ...asUserPojo });
};
