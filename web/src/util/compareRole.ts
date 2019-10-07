export type Roles = 'student' | 'teacher' | 'admin';

const RoleHiearchy: Roles[] = ['student', 'teacher', 'admin'];

const compareRole = (role1: Roles, role2: Roles) => {
  const ndx1 = RoleHiearchy.indexOf(role1);
  const ndx2 = RoleHiearchy.indexOf(role2);

  if (ndx1 < 0 || ndx2 < 0) {
    throw new Error(`can't compare roles: ${role1}, ${role2}`);
  }
  if (role1 < role2) {
    return -1;
  }
  if (role1 > role2) {
    return 1;
  }
  return 0;
};

export default compareRole;
