import { UserRoles } from '../graphql';

const USER_ROLE_HIEARCHY: UserRoles[] = ['student', 'teacher', 'admin'];

export const compareUserRoles = (role1: UserRoles, role2: UserRoles) => {
  const ndx1 = USER_ROLE_HIEARCHY.indexOf(role1);
  const ndx2 = USER_ROLE_HIEARCHY.indexOf(role2);

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
