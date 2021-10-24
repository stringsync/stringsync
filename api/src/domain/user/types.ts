// https://typegraphql.com/docs/enums.html#interoperability
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  cursor: number;
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
