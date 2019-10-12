import { FieldResolver } from '..';
import { User } from 'common/types';
import { asUserPojo } from '../../casters/user/asUserPojo';
import { UserModel } from '../../models/UserModel';

export const getUsers: FieldResolver<User[]> = async (parent, args, ctx) => {
  // if (!ctx.auth.isLoggedIn) {
  //   throw new AuthenticationError('must be logged in');
  // }
  return await UserModel.findAll({ ...asUserPojo });
};
