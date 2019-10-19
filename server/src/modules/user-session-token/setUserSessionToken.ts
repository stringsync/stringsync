import { Response } from 'express';
import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';
import { UserSessionModel } from '../../db/models/UserSessionModel';

export const setUserSessionToken = (
  userSession: UserSessionModel,
  maxAgeMs: number,
  res: Response
) => {
  res.cookie(USER_SESSION_TOKEN_COOKIE_NAME, userSession.token, {
    httpOnly: true,
    maxAge: maxAgeMs,
  });
};
