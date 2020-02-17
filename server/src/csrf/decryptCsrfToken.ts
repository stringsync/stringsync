import { CsrfTokenPayload } from './types';
import jwt from 'jsonwebtoken';
import { DUMMY_PAYLOAD } from './constants';
import { pick } from 'lodash';

const EXPECTED_KEYS = Object.keys(DUMMY_PAYLOAD);

export const decryptCsrfToken = (
  csrfToken: string,
  secret: string
): CsrfTokenPayload => {
  const json = jwt.verify(csrfToken, secret);

  if (typeof json !== 'object') {
    throw new TypeError('invalid csrf token');
  }

  const payload: Partial<CsrfTokenPayload> = pick(json, EXPECTED_KEYS);

  for (const key of EXPECTED_KEYS) {
    if (!(key in payload)) {
      throw new TypeError('invalid csrf token');
    }
  }

  payload.iat = new Date(payload.iat!);
  return payload as CsrfTokenPayload;
};
