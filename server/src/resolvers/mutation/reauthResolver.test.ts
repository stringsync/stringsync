import { reauthResolver } from './reauthResolver';
import { useTestCtx, getFixtures } from '../../testing';
import { getRawUserByEmailOrUsername } from '../../db';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;

it(
  'throws an error when not logged in',
  useTestCtx({}, {}, async (ctx) => {
    ctx.auth.isLoggedIn = false;
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when no user',
  useTestCtx({}, {}, async (ctx) => {
    ctx.auth.user = null;
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when no token',
  useTestCtx({}, {}, async (ctx) => {
    ctx.auth.token = '';
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when user session does not exist',
  useTestCtx({ User: [USER] }, {}, async (ctx) => {
    const user = await getRawUserByEmailOrUsername(ctx.db, USER.username);

    ctx.auth.isLoggedIn = true;
    ctx.auth.user = user;
    ctx.auth.token = USER_SESSION.token;

    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it.skip(
  'does not throw an error when user session exists',
  useTestCtx({ User: [USER], UserSession: [USER_SESSION] }, {}, async (ctx) => {
    const user = await getRawUserByEmailOrUsername(ctx.db, USER.username);

    ctx.auth.isLoggedIn = true;
    ctx.auth.user = user;
    ctx.auth.token = USER_SESSION.token;

    await expect(reauthResolver(undefined, {}, ctx)).resolves.not.toThrow();
  })
);
