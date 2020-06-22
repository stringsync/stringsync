import { UserRole } from '@stringsync/domain';

export interface SessionUser {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
}
