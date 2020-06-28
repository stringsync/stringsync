import { Notation } from '@stringsync/domain';
export interface User {
  id: string;
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
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}
