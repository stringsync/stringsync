import { UserRole } from '../../domain';

export enum AuthRequirement {
  NONE,
  LOGGED_IN,
  LOGGED_OUT,
  LOGGED_IN_AS_STUDENT,
  LOGGED_IN_AS_TEACHER,
  LOGGED_IN_AS_ADMIN,
}

export interface SessionUser {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
}
