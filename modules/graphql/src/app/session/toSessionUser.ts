import { User } from '@stringsync/domain';

export const toSessionUser = (user: User) => ({
  id: user.id,
  role: user.role,
  isLoggedIn: true,
});
