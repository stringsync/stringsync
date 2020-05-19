import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';
import { Response } from 'express';

interface UserSessionLike {
  token: string;
  expiresAt: Date;
}

export const setUserSessionTokenCookie = (
  userSession: UserSessionLike,
  res: Response
) => {
  res.cookie(USER_SESSION_TOKEN_COOKIE_NAME, userSession.token, {
    httpOnly: true,
    expires: userSession.expiresAt,
  });
};
