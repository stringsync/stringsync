import { FieldResolver } from '..';
import { UserTypeDef } from '../schema';
import { getUserTypeDef } from '../../util/getUserTypeDef';
import { UserModel } from '../../models/UserModel';

export const users: FieldResolver<UserTypeDef[]> = async () => {
  const userRecords = await UserModel.findAll();
  return userRecords.map(getUserTypeDef);
};
