import { convertCsrfToSession } from './convertCsrfToSession';
import { convertSessionToCsrf } from './convertSessionToCsrf';

const SECRET = 'SECRET';
const SESSION_TOKEN = 'SESSION_TOKEN';

it('decrypts a csrf token', () => {
  const csrfToken = convertSessionToCsrf(SESSION_TOKEN, SECRET);
  const sessionToken = convertCsrfToSession(csrfToken, SECRET);

  expect(sessionToken).toBe(SESSION_TOKEN);
});
