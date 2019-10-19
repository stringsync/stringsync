import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';
import { RawUserSession } from '../../db/models/UserSessionModel';
import { RequestContext } from '../request-context';

export const setUserSessionTokenCookie = (
  userSession: RawUserSession,
  ctx: RequestContext
) => {
  ctx.res.cookie(USER_SESSION_TOKEN_COOKIE_NAME, userSession.token, {
    httpOnly: true,
    expires: userSession.expiresAt,
  });
};
