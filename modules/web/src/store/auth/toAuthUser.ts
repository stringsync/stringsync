import { UserObject } from '../../clients';
import { AuthUser } from './types';
import { toUserRole } from './toUserRole';

export const toAuthUser = (user: UserObject): AuthUser => ({
  id: parseInt(user.id, 10),
  email: user.email,
  role: toUserRole(user.role),
  username: user.username,
  confirmedAt: user.confirmedAt || null,
});
