import { JWT_COOKIE_NAME } from '.';
import { Response } from 'express';

export const clearAuthJwtCookie = (res: Response) => {
  res.clearCookie(JWT_COOKIE_NAME);
};
