import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';
import { RawUserSession } from '../db';
import { Response } from 'express';

export const setUserSessionTokenCookie = (
  userSession: RawUserSession,
  res: Response
) => {
  res.cookie(USER_SESSION_TOKEN_COOKIE_NAME, userSession.token, {
    httpOnly: true,
    expires: userSession.expiresAt,
  });
};
