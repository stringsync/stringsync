import { User } from 'common/types';
import { UserModel } from '../../models/UserModel';
import { MissingCasterError } from '..';

const fromUserModelToUserPojo = (userModel: UserModel) => ({
  id: userModel.id,
  username: userModel.username,
  email: userModel.email,
  createdAt: userModel.createdAt,
  updatedAt: userModel.updatedAt,
  role: userModel.role,
});

export const toUserPojo = (from: UserModel): User => {
  if (from instanceof UserModel) {
    return fromUserModelToUserPojo(from);
  }
  throw new MissingCasterError('user');
};
