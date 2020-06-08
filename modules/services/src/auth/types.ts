import { UserRole } from '@stringsync/domain';

export interface SessionUser {
  id: number;
  role: UserRole;
  isLoggedIn: boolean;
}
