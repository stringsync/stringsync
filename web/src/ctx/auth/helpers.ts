import { GraphQLError } from 'graphql';
import { UnknownError } from '../../lib/errors';
import { UserRole } from '../../lib/graphql';
import { getNullAuthUser } from './getNullAuthUser';
import { AuthUser } from './types';

type AuthUserLike = Omit<AuthUser, 'role'> & {
  role: UserRole;
};

export const toAuthUser = (authUserLike: AuthUserLike | null): AuthUser => {
  return authUserLike || getNullAuthUser();
};

export const toErrorStrings = (errors: GraphQLError[] | void): string[] => {
  return (errors || [new UnknownError()]).map((error) => error.message);
};
