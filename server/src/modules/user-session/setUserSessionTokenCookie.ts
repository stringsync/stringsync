import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';
import { RequestContext } from '../request-context';
import { UserSessionModel } from '../../db/models/types';

export const setUserSessionTokenCookie = (
  userSession: UserSessionModel,
  ctx: RequestContext
) => {
  ctx.res.cookie(USER_SESSION_TOKEN_COOKIE_NAME, userSession.token, {
    httpOnly: true,
    expires: userSession.expiresAt,
  });
};
