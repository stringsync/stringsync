export type UserRoles = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoles;
}
