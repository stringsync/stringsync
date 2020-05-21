import { Middleware } from './types';
import { ForbiddenError } from '../../common/errors';
import { AuthRequirements, compareUserRoles } from '../../common';

export const withAuthRequirement = (authReqs: AuthRequirements): Middleware => (
  next
) => async (src, args, ctx, info) => {
  const { isLoggedIn, role } = ctx.req.session.user;

  switch (authReqs) {
    case AuthRequirements.NONE:
      return next(src, args, ctx, info);
    case AuthRequirements.LOGGED_IN:
      if (isLoggedIn) {
        return next(src, args, ctx, info);
      } else {
        throw new ForbiddenError('must be logged in');
      }
    case AuthRequirements.LOGGED_OUT:
      if (!isLoggedIn) {
        return next(src, args, ctx, info);
      } else {
        throw new ForbiddenError('must be logged out');
      }
    case AuthRequirements.LOGGED_IN_AS_STUDENT:
      if (isLoggedIn && compareUserRoles(role, 'student') >= 0) {
        return next(src, args, ctx, info);
      } else {
        throw new ForbiddenError('must be logged in as a student');
      }
    case AuthRequirements.LOGGED_IN_AS_TEACHER:
      if (isLoggedIn && compareUserRoles(role, 'teacher') >= 0) {
        return next(src, args, ctx, info);
      } else {
        throw new ForbiddenError('must be logged in as a teacher');
      }
    case AuthRequirements.LOGGED_IN_AS_ADMIN:
      if (isLoggedIn && compareUserRoles(role, 'admin') >= 0) {
        return next(src, args, ctx, info);
      } else {
        throw new ForbiddenError('must be logged in as a admin');
      }
    default:
      throw new Error('should never reach');
  }
};
