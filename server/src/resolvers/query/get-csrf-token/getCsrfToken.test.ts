import { getCsrfToken } from './getCsrfToken';
import { convertCsrfToSession } from '../../../csrf';
import { useTestReqCtx, getFixtures } from '../../../testing';

const NOW = new Date();
const CSRF_SECRET = 'CSRF_SECRET';
const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;

it(
  'returns a token for logged out sessions',
  useTestReqCtx({ requestedAt: NOW, config: { CSRF_SECRET } }, (ctx) => {
    const csrfToken = getCsrfToken(undefined, {}, ctx);
    const sessionToken = convertCsrfToSession(csrfToken, CSRF_SECRET);

    expect(sessionToken).toBe('');
  })
);

it(
  'returns a token for logged in sessions',
  useTestReqCtx(
    {
      fixtures: {
        User: [USER],
        UserSession: [USER_SESSION],
      },
      requestedAt: NOW,
      config: { CSRF_SECRET },
      cookies: {
        USER_SESSION_TOKEN: USER_SESSION.token,
      },
    },
    (ctx) => {
      const csrfToken = getCsrfToken(undefined, {}, ctx);
      const sessionToken = convertCsrfToSession(csrfToken, CSRF_SECRET);

      expect(sessionToken).toBe(USER_SESSION.token);
    }
  )
);
