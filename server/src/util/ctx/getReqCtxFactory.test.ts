import { getReqCtxFactory } from './getReqCtxFactory';
import {
  useTestGlobalCtx,
  getMockExpressContext,
  getFixtures,
  getCookieStr,
} from '../testing';
import { getConfig } from '../config';
import { createGlobalCtx } from '../ctx';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;
const USER_SESSION_TOKEN = USER_SESSION.token;

it(
  'sets cookies',
  useTestGlobalCtx({}, async (globalCtx) => {
    const cookies = {
      USER_SESSION_TOKEN,
      OTHER_COOKIE: 'bar',
    };

    const expressContext = getMockExpressContext({
      req: {
        headers: {
          cookie: getCookieStr(cookies),
        },
      },
    });
    const createReqCtx = getReqCtxFactory(globalCtx);
    const reqCtx = await createReqCtx(expressContext);

    expect(reqCtx.cookies).toEqual(cookies);
  })
);

it(
  'can override requestedAt',
  useTestGlobalCtx({}, async (globalCtx) => {
    const now = new Date();
    const expressContext = getMockExpressContext({});

    const createReqCtx = getReqCtxFactory(globalCtx);
    const reqCtx = await createReqCtx(expressContext, now);

    expect(reqCtx.requestedAt).toEqual(now);
  })
);

it('uses the global db connection', async () => {
  const expressContext = getMockExpressContext({});
  const config = getConfig(process.env);
  const globalCtx = createGlobalCtx(config);
  const createReqCtx = getReqCtxFactory(globalCtx);
  const reqCtx = await createReqCtx(expressContext);

  expect(reqCtx.db).toBe(globalCtx.db);
});

it(
  'creates the auth object when logged in',
  useTestGlobalCtx(
    { fixtures: { User: [USER], UserSession: [USER_SESSION] } },
    async (globalCtx) => {
      const cookies = {
        USER_SESSION_TOKEN,
      };
      const expressContext = getMockExpressContext({
        req: {
          headers: {
            cookie: getCookieStr(cookies),
          },
        },
      });

      const createReqCtx = getReqCtxFactory(globalCtx);
      const reqCtx = await createReqCtx(expressContext, USER_SESSION.issuedAt);

      const { auth } = reqCtx;
      expect(auth.isLoggedIn).toBe(true);
      expect(auth.user).not.toBeNull();
      expect(auth.user!.id).toBe(USER.id);
      expect(auth.token).toBe(USER_SESSION_TOKEN);
    }
  )
);

it(
  'creates the auth object when not logged in',
  useTestGlobalCtx({}, async (globalCtx) => {
    const expressContext = getMockExpressContext({});

    const createReqCtx = getReqCtxFactory(globalCtx);
    const reqCtx = await createReqCtx(expressContext);

    const { auth } = reqCtx;
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.token).toBe('');
  })
);
