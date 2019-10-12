import { User } from 'common/types';
import { UserModel } from '../../models/UserModel';
import { MissingCasterError } from '..';

const fromUserModelToUserType = (userRecord: UserModel) => ({
  id: userRecord.id,
  username: userRecord.username,
  email: userRecord.email,
  createdAt: userRecord.createdAt,
  updatedAt: userRecord.updatedAt,
});

export const toUserType = (from: UserModel): User => {
  if (from instanceof UserModel) {
    return fromUserModelToUserType(from);
  }
  throw new MissingCasterError('user');
};
