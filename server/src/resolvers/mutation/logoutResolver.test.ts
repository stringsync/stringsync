import { logoutResolver } from './logoutResolver';
import { getFixtures, useTestCtx } from '../../testing';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;
const NOW = USER_SESSION.issuedAt;
const LOGGED_IN_HEADERS = {
  cookie: `USER_SESSION_TOKEN=${USER_SESSION.token}`,
};

it(
  'should clear the user session token from cookies',
  useTestCtx(
    { User: [USER], UserSession: [USER_SESSION] },
    { requestedAt: NOW, req: { headers: LOGGED_IN_HEADERS } },
    async (ctx) => {
      await logoutResolver(undefined, {}, ctx);

      expect(ctx.res.cookies['USER_SESSION_TOKEN'].value).toBe('');
    }
  )
);

it(
  'should remove the user session from the database',
  useTestCtx(
    { User: [USER], UserSession: [USER_SESSION] },
    { requestedAt: NOW, req: { headers: LOGGED_IN_HEADERS } },
    async (ctx) => {
      await logoutResolver(undefined, {}, ctx);

      const userSession = await ctx.db.models.UserSession.findOne({
        where: { token: USER_SESSION.token },
      });
      expect(userSession).toBeNull();
    }
  )
);

it(
  'returns the user that was logged out',
  useTestCtx(
    { User: [USER], UserSession: [USER_SESSION] },
    { requestedAt: NOW, req: { headers: LOGGED_IN_HEADERS } },
    async (ctx) => {
      const { user } = await logoutResolver(undefined, {}, ctx);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(USER.id);
    }
  )
);
