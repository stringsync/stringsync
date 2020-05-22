export type UserRoles = 'student' | 'teacher' | 'admin';

export const USER_ROLE_HIEARCHY: UserRoles[] = ['student', 'teacher', 'admin'];

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt: Date | null;
  role: UserRoles;
}

export interface Notation {
  id: string;
}
