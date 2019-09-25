import { FieldResolver } from '..';
import { UserType } from '../schema';
import { getUserType } from '../../util/getUserType';
import { UserModel } from 'src/models/UserModel';

export const getUsers: FieldResolver<UserType[]> = async (
  parent,
  args,
  ctx
) => {
  const userRecords = await UserModel.findAll();
  const users = userRecords.map(getUserType);
  return users;
};
