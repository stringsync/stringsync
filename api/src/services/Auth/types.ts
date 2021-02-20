import { UserRole } from '../../domain';

export interface SessionUser {
  id: string;
  role: UserRole;
  isLoggedIn: boolean;
}
