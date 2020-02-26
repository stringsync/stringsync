import { User, UserRoles } from '../common/types';
import { compareUserRoles } from '../util';
import { ForbiddenError } from 'apollo-server';

export const guardUserRole = (role: UserRoles, user: User | null) => {
  if (!user) {
    throw new ForbiddenError('must be logged in');
  }
  if (compareUserRoles(user.role, role) < 0) {
    throw new ForbiddenError(`${user.username} is not role: ${role}`);
  }
};
