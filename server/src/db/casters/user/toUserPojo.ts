import { User } from 'common/types';
import { UserModel } from '../../models/UserModel';

export const toUserPojo = (userModel: UserModel): User => ({
  id: userModel.id,
  username: userModel.username,
  email: userModel.email,
  createdAt: userModel.createdAt,
  updatedAt: userModel.updatedAt,
  role: userModel.role,
});
