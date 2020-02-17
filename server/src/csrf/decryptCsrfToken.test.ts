import { decryptCsrfToken } from './decryptCsrfToken';
import { CsrfTokenPayload } from './types';
import { encryptCsrfToken } from './encryptCsrfToken';
import { Query } from 'pg';

const SECRET = 'SECRET';
const SESSION_TOKEN = 'SESSION_TOKEN';
const NOW = new Date();
const PAYLOAD: CsrfTokenPayload = {
  iat: NOW,
  session: SESSION_TOKEN,
};

it('decrypts a csrf token', () => {
  const csrfToken = encryptCsrfToken(PAYLOAD, SECRET);
  const payload = decryptCsrfToken(csrfToken, SECRET);

  expect(payload).toStrictEqual(PAYLOAD);
});

it('ignores extra properties', () => {
  const payloadWithExtra = { ...PAYLOAD, foo: 'bar' } as CsrfTokenPayload;
  const csrfToken = encryptCsrfToken(payloadWithExtra, SECRET);
  const payload = decryptCsrfToken(csrfToken, SECRET);

  expect(payload).toStrictEqual(PAYLOAD);
});
