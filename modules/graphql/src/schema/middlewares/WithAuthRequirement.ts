import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../types';
import { AuthRequirement, ForbiddenError } from '@stringsync/common';
import { compareUserRoles, UserRole } from '@stringsync/domain';

export const WithAuthRequirement = (authReq: AuthRequirement): MiddlewareFn<ResolverCtx> => async (data, next) => {
  const { isLoggedIn, role } = data.context.req.session.user;

  switch (authReq) {
    case AuthRequirement.NONE:
      return next();
    case AuthRequirement.LOGGED_IN:
      if (isLoggedIn) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in');
      }
    case AuthRequirement.LOGGED_OUT:
      if (!isLoggedIn) {
        return next();
      } else {
        throw new ForbiddenError('must be logged out');
      }
    case AuthRequirement.LOGGED_IN_AS_STUDENT:
      if (isLoggedIn && compareUserRoles(role, UserRole.STUDENT) >= 0) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in as a student');
      }
    case AuthRequirement.LOGGED_IN_AS_TEACHER:
      if (isLoggedIn && compareUserRoles(role, UserRole.TEACHER) >= 0) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in as a teacher');
      }
    case AuthRequirement.LOGGED_IN_AS_ADMIN:
      if (isLoggedIn && compareUserRoles(role, UserRole.ADMIN) >= 0) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in as a admin');
      }
    default:
      throw new Error('should never reach');
  }
};
