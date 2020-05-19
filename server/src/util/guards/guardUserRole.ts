import { User, UserRoles, compareUserRoles } from '../../common';

export const guardUserRole = (role: UserRoles, user: User | null) => {
  if (!user) {
    throw new Error('must be logged in');
  }
  if (compareUserRoles(user.role, role) < 0) {
    throw new Error(`${user.username} is not role: ${role}`);
  }
};
