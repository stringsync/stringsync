import { toUserRole, UserRoles } from '../../graphql';
import { AuthUser } from './types';

type AuthUserLike = Omit<AuthUser, 'role'> & {
  role: UserRoles;
};

export const toAuthUser = (authUserLike: AuthUserLike): AuthUser => {
  const role = toUserRole(authUserLike.role);
  return { ...authUserLike, role };
};
