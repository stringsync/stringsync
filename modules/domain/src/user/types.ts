import { Notation } from '../notation';

export interface User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  encryptedPassword: string;
  role: UserRole;
  confirmationToken: string | null;
  confirmedAt: Date | null;
  resetPasswordToken: string | null;
  resetPasswordTokenSentAt: Date | null;
  avatarUrl: string | null;
  notations?: Notation[];
}

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}
