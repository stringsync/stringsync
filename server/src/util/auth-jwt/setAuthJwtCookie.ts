import { Response } from 'express';
import { JWT_MAX_AGE_MS, JWT_COOKIE_NAME } from '.';

export const setAuthJwtCookie = (jwt: string, res: Response): void => {
  res.cookie(JWT_COOKIE_NAME, jwt, {
    httpOnly: true,
    maxAge: JWT_MAX_AGE_MS,
  });
};
