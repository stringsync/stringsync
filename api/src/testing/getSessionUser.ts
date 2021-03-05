import { User, UserRole } from '../domain';
import { SessionUser } from '../server';

export enum LoginStatus {
  LOGGED_IN_AS_ADMIN = 'LOGGED_IN_AS_ADMIN',
  LOGGED_IN_AS_TEACHER = 'LOGGED_IN_AS_TEACHER',
  LOGGED_IN_AS_STUDENT = 'LOGGED_IN_AS_STUDENT',
  LOGGED_OUT = 'LOGGED_OUT',
}

type Users = {
  admin: User;
  teacher: User;
  student: User;
};

export const getSessionUser = (users: Users, loginStatus: LoginStatus): SessionUser => {
  switch (loginStatus) {
    case LoginStatus.LOGGED_IN_AS_ADMIN:
      return { id: users.admin.id, isLoggedIn: true, role: users.admin.role };
    case LoginStatus.LOGGED_IN_AS_TEACHER:
      return { id: users.teacher.id, isLoggedIn: true, role: users.teacher.role };
    case LoginStatus.LOGGED_IN_AS_STUDENT:
      return { id: users.student.id, isLoggedIn: true, role: users.student.role };
    case LoginStatus.LOGGED_OUT:
      return { id: '', isLoggedIn: false, role: UserRole.STUDENT };
    default:
      throw new Error(`unhandled loging status: ${loginStatus}`);
  }
};
