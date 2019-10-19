import { Request } from 'express';
import { USER_SESSION_TOKEN_COOKIE_NAME } from './constants';

export const getUserSessionToken = (req: Request): string => {
  return req.cookies[USER_SESSION_TOKEN_COOKIE_NAME] || '';
};
