import { GraphQLError } from 'graphql';
import { UnknownError } from '../../errors';
import { toUserRole, UserRoles } from '../../graphql';
import { getNullAuthUser } from './getNullAuthUser';
import { AuthUser } from './types';

type AuthUserLike = Omit<AuthUser, 'role'> & {
  role: UserRoles;
};

export const toAuthUser = (authUserLike: AuthUserLike | null): AuthUser => {
  if (!authUserLike) {
    return getNullAuthUser();
  }
  const role = toUserRole(authUserLike.role);
  return { ...authUserLike, role };
};

export const toErrorStrings = (errors: GraphQLError[] | void): string[] => {
  return (errors || [new UnknownError()]).map((error) => error.message);
};
