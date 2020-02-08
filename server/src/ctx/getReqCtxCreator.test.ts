import { getReqCtxCreator } from './getReqCtxCreator';
import {
  useTestDb,
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
  useTestDb({}, async (db) => {
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

    const config = getConfig(process.env);
    const globalCtx = createGlobalCtx(config);
    const createRequestContext = getReqCtxCreator(globalCtx);
    const ctx = await createRequestContext(expressContext);

    expect(ctx.cookies).toEqual(cookies);
  })
);

it(
  'can override requestedAt',
  useTestDb({}, async (db) => {
    const now = new Date();
    const expressContext = getMockExpressContext({});

    const config = getConfig(process.env);
    const globalCtx = createGlobalCtx(config);
    const createRequestContext = getReqCtxCreator(globalCtx);
    const ctx = await createRequestContext(expressContext, now);

    expect(ctx.requestedAt).toEqual(now);
  })
);

it(
  'proxies its db connection',
  useTestDb({}, async (db) => {
    const expressContext = getMockExpressContext({});

    const config = getConfig(process.env);
    const globalCtx = createGlobalCtx(config);
    const createRequestContext = getReqCtxCreator(globalCtx);
    const ctx = await createRequestContext(expressContext);

    expect(ctx.db).toBe(db);
  })
);

it(
  'creates the auth object when logged in',
  useTestDb({ User: [USER], UserSession: [USER_SESSION] }, async (db) => {
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

    const config = getConfig(process.env);
    const globalCtx = createGlobalCtx(config);
    const createRequestContext = getReqCtxCreator(globalCtx);
    const ctx = await createRequestContext(
      expressContext,
      USER_SESSION.issuedAt
    );

    const { auth } = ctx;
    expect(auth.isLoggedIn).toBe(true);
    expect(auth.user).not.toBeNull();
    expect(auth.user!.id).toBe(USER.id);
    expect(auth.token).toBe(USER_SESSION_TOKEN);
  })
);

it(
  'creates the auth object when not logged in',
  useTestDb({}, async (db) => {
    const expressContext = getMockExpressContext({});

    const config = getConfig(process.env);
    const globalCtx = createGlobalCtx(config);
    const createRequestContext = getReqCtxCreator(globalCtx);
    const ctx = await createRequestContext(expressContext);

    const { auth } = ctx;
    expect(auth.isLoggedIn).toBe(false);
    expect(auth.user).toBeNull();
    expect(auth.token).toBe('');
  })
);
