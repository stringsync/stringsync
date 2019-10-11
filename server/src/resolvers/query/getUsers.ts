import { FieldResolver } from '..';
import { UserType } from '../types';
import { asUserType } from '../../casters/user/asUserType';
import { UserModel } from '../../models/UserModel';

export const getUsers: FieldResolver<UserType[]> = async (
  parent,
  args,
  ctx
) => {
  // if (!ctx.auth.isLoggedIn) {
  //   throw new AuthenticationError('must be logged in');
  // }
  return await UserModel.findAll({ ...asUserType });
};
