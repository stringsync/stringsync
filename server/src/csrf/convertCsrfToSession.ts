import jwt from 'jsonwebtoken';
import { CsrfTokenPayload } from './types';

export const convertCsrfToSession = (
  csrfToken: string,
  secret: string
): string => {
  const payload: Partial<CsrfTokenPayload> | string = jwt.verify(
    csrfToken,
    secret
  );

  if (typeof payload !== 'object') {
    throw new Error('invalid csrf token');
  }

  if (typeof payload.sessionToken === 'undefined') {
    throw new Error('invalid csrf token');
  }

  return payload.sessionToken;
};
