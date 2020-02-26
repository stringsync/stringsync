import { User } from '../../../common/types';

type UserLike = {
  [P in keyof User]: User[P];
};

export const toCanonicalUser = (userLike: UserLike): User => ({
  id: userLike.id,
  createdAt: userLike.createdAt,
  email: userLike.email,
  role: userLike.role,
  updatedAt: userLike.updatedAt,
  username: userLike.username,
});
