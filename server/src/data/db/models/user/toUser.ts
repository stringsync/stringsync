import { User } from '../../../../common';

export const toUser = (userLike: User): User => ({
  id: userLike.id,
  email: userLike.email,
  role: userLike.role,
  username: userLike.username,
  createdAt: userLike.createdAt,
  updatedAt: userLike.updatedAt,
  confirmedAt: userLike.confirmedAt,
});
