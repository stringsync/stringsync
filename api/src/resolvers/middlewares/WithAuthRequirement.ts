import { MiddlewareFn } from 'type-graphql';
import { gtEqAdmin, gtEqStudent, gtEqTeacher } from '../../domain';
import { ForbiddenError } from '../../errors';
import { ReqCtx } from '../../graphql';
import { AuthRequirement } from '../../services';

export const WithAuthRequirement = (authReq: AuthRequirement): MiddlewareFn<ReqCtx> => async (data, next) => {
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
      if (isLoggedIn && gtEqStudent(role)) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in as a student');
      }
    case AuthRequirement.LOGGED_IN_AS_TEACHER:
      if (isLoggedIn && gtEqTeacher(role)) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in as a teacher');
      }
    case AuthRequirement.LOGGED_IN_AS_ADMIN:
      if (isLoggedIn && gtEqAdmin(role)) {
        return next();
      } else {
        throw new ForbiddenError('must be logged in as a admin');
      }
    default:
      throw new Error('should never reach');
  }
};
