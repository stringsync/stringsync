import { UserRoles } from '../../common';

export interface SessionUser {
  id: string;
  role: UserRoles;
  isLoggedIn: boolean;
}
