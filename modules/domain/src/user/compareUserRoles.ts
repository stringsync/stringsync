import { UserRole } from './types';
import { USER_ROLES } from './constants';

export const compareUserRoles = (role1: UserRole, role2: UserRole) => {
  const ndx1 = USER_ROLES.indexOf(role1);
  const ndx2 = USER_ROLES.indexOf(role2);

  if (ndx1 < 0 || ndx2 < 0) {
    throw new Error(`can't compare roles: ${role1}, ${role2}`);
  }
  if (ndx1 < ndx2) {
    return -1;
  }
  if (ndx1 > ndx2) {
    return 1;
  }
  return 0;
};
