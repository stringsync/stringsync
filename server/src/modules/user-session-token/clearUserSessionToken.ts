import { Response } from 'express';
import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';

export const clearUserSessionToken = (res: Response) => {
  res.clearCookie(USER_SESSION_TOKEN_COOKIE_NAME);
};
