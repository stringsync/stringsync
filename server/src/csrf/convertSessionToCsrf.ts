import jwt from 'jsonwebtoken';
import { CsrfTokenPayload } from './types';

export const convertSessionToCsrf = (
  sessionToken: string,
  secret: string
): string => {
  const payload: CsrfTokenPayload = { sessionToken };
  return jwt.sign(payload, secret, { expiresIn: 86400 });
};
