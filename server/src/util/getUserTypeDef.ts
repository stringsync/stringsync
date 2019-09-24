import { UserModel } from '../models/UserModel';
import { UserTypeDef } from '../resolvers/schema';

export const getUserTypeDef = (userRecord: UserModel): UserTypeDef => {
  return {
    id: userRecord.id,
    username: userRecord.username,
    email: userRecord.email,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt,
  };
};
