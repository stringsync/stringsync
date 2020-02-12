import { logout } from './logout';
import { getFixtures, useTestReqCtx } from '../../../testing';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;
const USER_SESSION_TOKEN = USER_SESSION.token;
const NOW = USER_SESSION.issuedAt;

it(
  'should clear the user session token from cookies',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: NOW,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      await logout(undefined, {}, ctx);

      expect(ctx.res.cookies['USER_SESSION_TOKEN'].value).toBe('');
    }
  )
);

it(
  'should remove the user session from the database',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: NOW,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      await logout(undefined, {}, ctx);

      const userSession = await ctx.db.models.UserSession.findOne({
        where: { token: USER_SESSION_TOKEN },
      });
      expect(userSession).toBeNull();
    }
  )
);

it(
  'returns the user that was logged out',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: NOW,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      const { user } = await logout(undefined, {}, ctx);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(USER.id);
    }
  )
);
