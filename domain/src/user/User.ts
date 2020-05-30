import { UserRoles } from './UserRoles';

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  encryptedPassword: string;
  role: UserRoles;
  confirmationToken: string | null;
  confirmedAt: Date | null;
  resetPasswordToken: string | null;
  resetPasswordTokenSentAt: Date | null;
  avatarUrl: string | null;
}
