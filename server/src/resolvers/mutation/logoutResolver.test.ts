import { logoutResolver } from './logoutResolver';
import {
  getUserFixtures,
  getUserSessionFixtures,
  getTestCtxProvider,
} from '../../testing';
import { clearUserSessionTokenCookie } from '../../user-session/';

const STUDENT1 = getUserFixtures().student1;
const STUDENT1_SESSION = getUserSessionFixtures().student1Session;

jest.mock('../../user-session/', () => ({
  clearUserSessionTokenCookie: jest.fn(),
}));

const provideTestCtx = getTestCtxProvider();

it(
  'should clear the user session token from cookies',
  provideTestCtx({}, async (ctx) => {
    await logoutResolver(undefined, {}, ctx);

    expect(clearUserSessionTokenCookie).toBeCalledTimes(1);
  })
);

it(
  'should remove the user session from the database',
  provideTestCtx(
    { User: [STUDENT1], UserSession: [STUDENT1_SESSION] },
    async (ctx) => {
      const { User, UserSession } = ctx.db.models;

      // setup ctx to appear logged in
      ctx.auth.token = STUDENT1_SESSION.token;
      ctx.auth.user = await User.findOne({
        where: { id: STUDENT1.id },
      });
      ctx.auth.isLoggedIn = true;

      // check that user session exists in db
      let userSession = await UserSession.findOne({
        where: { token: STUDENT1_SESSION.token },
      });
      expect(userSession).not.toBeNull();

      // do logout
      await logoutResolver(undefined, {}, ctx);

      // check that user session does not exist is db
      userSession = await UserSession.findOne({
        where: { token: STUDENT1_SESSION.token },
      });
      expect(userSession).toBeNull();
    }
  )
);

it(
  'returns the user that was logged out',
  provideTestCtx(
    { User: [STUDENT1], UserSession: [STUDENT1_SESSION] },
    async (ctx) => {
      // setup ctx to appear logged in
      ctx.auth.token = STUDENT1_SESSION.token;
      ctx.auth.user = await ctx.db.models.User.findOne({
        where: { id: STUDENT1.id },
      });
      ctx.auth.isLoggedIn = true;

      const { user } = await logoutResolver(undefined, {}, ctx);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(STUDENT1.id);
    }
  )
);
