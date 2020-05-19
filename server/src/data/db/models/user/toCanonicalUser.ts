import { User } from '../../../../common';

type UserLike = {
  [P in keyof User]: User[P];
};

export const toCanonicalUser = (userLike: UserLike): User => ({
  id: userLike.id,
  email: userLike.email,
  role: userLike.role,
  username: userLike.username,
  createdAt: userLike.createdAt,
  updatedAt: userLike.updatedAt,
  confirmedAt: userLike.confirmedAt,
});
