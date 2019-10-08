import { Response } from 'express';
import { JWT_MAX_AGE_MS } from './createAuthJwt';

export const JWT_COOKIE_NAME = 'ss:auth:jwt';

export const setAuthJwtCookie = (jwt: string, res: Response) => {
  res.cookie(JWT_COOKIE_NAME, jwt, {
    httpOnly: true,
    maxAge: JWT_MAX_AGE_MS,
  });
};
