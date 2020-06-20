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

export const ltStudent = (role: UserRole) => compareUserRoles(role, UserRole.STUDENT) < 0;
export const ltEqStudent = (role: UserRole) => compareUserRoles(role, UserRole.STUDENT) <= 0;
export const eqStudent = (role: UserRole) => compareUserRoles(role, UserRole.STUDENT) === 0;
export const gtEqStudent = (role: UserRole) => compareUserRoles(role, UserRole.STUDENT) >= 0;
export const gtStudent = (role: UserRole) => compareUserRoles(role, UserRole.STUDENT) > 0;

export const ltTeacher = (role: UserRole) => compareUserRoles(role, UserRole.TEACHER) < 0;
export const ltEqTeacher = (role: UserRole) => compareUserRoles(role, UserRole.TEACHER) <= 0;
export const eqTeacher = (role: UserRole) => compareUserRoles(role, UserRole.TEACHER) === 0;
export const gtEqTeacher = (role: UserRole) => compareUserRoles(role, UserRole.TEACHER) >= 0;
export const gtTeacher = (role: UserRole) => compareUserRoles(role, UserRole.TEACHER) > 0;

export const ltAdmin = (role: UserRole) => compareUserRoles(role, UserRole.ADMIN) < 0;
export const ltEqAdmin = (role: UserRole) => compareUserRoles(role, UserRole.ADMIN) <= 0;
export const eqAdmin = (role: UserRole) => compareUserRoles(role, UserRole.ADMIN) === 0;
export const gtEqAdmin = (role: UserRole) => compareUserRoles(role, UserRole.ADMIN) >= 0;
export const gtAdmin = (role: UserRole) => compareUserRoles(role, UserRole.ADMIN) > 0;
