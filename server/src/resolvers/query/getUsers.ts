import { FieldResolver } from '..';
import { UserType } from '../schema';
import { getUserType } from '../../util/getUserType';
import { UserModel } from '../../models/UserModel';

export const getUsers: FieldResolver<UserType[]> = async () => {
  const userRecords = await UserModel.findAll();
  return userRecords.map(getUserType);
};
