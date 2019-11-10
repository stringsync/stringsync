import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';
import { UserSessionModel } from '../db';
import { Response } from 'express';

export const setUserSessionTokenCookie = (
  userSession: UserSessionModel,
  res: Response
) => {
  res.cookie(USER_SESSION_TOKEN_COOKIE_NAME, userSession.token, {
    httpOnly: true,
    expires: userSession.expiresAt,
  });
};
