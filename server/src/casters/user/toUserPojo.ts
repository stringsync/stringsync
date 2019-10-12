import { User } from 'common/types';
import { UserModel } from '../../models/UserModel';
import { MissingCasterError } from '..';

const fromUserModelToUserPojo = (userRecord: UserModel) => ({
  id: userRecord.id,
  username: userRecord.username,
  email: userRecord.email,
  createdAt: userRecord.createdAt,
  updatedAt: userRecord.updatedAt,
});

export const toUserPojo = (from: UserModel): User => {
  if (from instanceof UserModel) {
    return fromUserModelToUserPojo(from);
  }
  throw new MissingCasterError('user');
};
