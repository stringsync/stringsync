import { FieldResolver } from '..';
import { UserType } from '../schema';
import { getUserType } from '../../util/getUserType';
import { UserModel } from '../../models/UserModel';
import { AuthenticationError } from 'apollo-server';

export const getUsers: FieldResolver<UserType[]> = async (
  parent,
  args,
  ctx
) => {
  if (!ctx.auth.isLoggedIn) {
    throw new AuthenticationError('must be logged in');
  }
  const userRecords = await UserModel.findAll();
  const users = userRecords.map(getUserType);
  return users;
};
