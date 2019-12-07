import { reauthResolver } from './reauthResolver';
import { useTestCtx, getFixtures } from '../../testing';
import { getRawUserByEmailOrUsername } from '../../db';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;
const USER_SESSION_TOKEN = USER_SESSION.token;

it(
  'throws an error when not logged in',
  useTestCtx({}, {}, async (ctx) => {
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when no user',
  useTestCtx({}, {}, async (ctx) => {
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when no token',
  useTestCtx({}, {}, async (ctx) => {
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when user session does not exist',
  useTestCtx({ User: [USER] }, {}, async (ctx) => {
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'does not throw an error when user session exists',
  useTestCtx(
    { User: [USER], UserSession: [USER_SESSION] },
    { requestedAt: USER_SESSION.issuedAt, cookies: { USER_SESSION_TOKEN } },
    async (ctx) => {
      await expect(reauthResolver(undefined, {}, ctx)).resolves.not.toThrow();
    }
  )
);
