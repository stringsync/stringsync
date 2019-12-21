export type Roles = 'student' | 'teacher' | 'admin';

const ROLE_HIEARCHY: Roles[] = ['student', 'teacher', 'admin'];

export const compareRole = (role1: Roles, role2: Roles) => {
  const ndx1 = ROLE_HIEARCHY.indexOf(role1);
  const ndx2 = ROLE_HIEARCHY.indexOf(role2);

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
