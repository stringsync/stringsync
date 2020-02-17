import jwt from 'jsonwebtoken';
import { CsrfTokenPayload } from './types';

export const encryptCsrfToken = (
  payload: CsrfTokenPayload,
  secret: string
): string => {
  const json = JSON.stringify(payload);
  return jwt.sign(json, secret);
};
