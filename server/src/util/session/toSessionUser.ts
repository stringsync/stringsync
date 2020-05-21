import { User } from '../../common';

export const toSessionUser = (user: User) => ({
  id: user.id,
  role: user.role,
  isLoggedIn: true,
});
