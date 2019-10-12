export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoles;
}

export type UserRoles = 'student' | 'teacher' | 'admin';
