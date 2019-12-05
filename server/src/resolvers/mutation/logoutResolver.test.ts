import { logoutResolver } from './logoutResolver';
import { getFixtures, getTestCtxProvider } from '../../testing';
import { clearUserSessionTokenCookie } from '../../user-session/';
import { RequestContext } from '../../request-context';
import { RawUser } from '../../db';

const NOW = new Date();
const FIXTURES = getFixtures();
const STUDENT1: RawUser = {
  ...FIXTURES.User.student1,
  createdAt: NOW,
  updatedAt: NOW,
  role: 'student',
  confirmationToken: '',
  confirmedAt: null,
  resetPasswordToken: '',
  resetPasswordTokenSentAt: null,
  avatarUrl: '',
};
const STUDENT1_SESSION = FIXTURES.UserSession.student1Session;

jest.mock('../../user-session/', () => ({
  clearUserSessionTokenCookie: jest.fn(),
}));

const provideTestCtx = getTestCtxProvider();

const appearLoggedIn = (
  ctx: RequestContext,
  token: string,
  user: RawUser
): void => {
  // setup ctx to appear logged in
  ctx.auth.token = token;
  ctx.auth.user = user;
  ctx.auth.isLoggedIn = true;
};

it(
  'should clear the user session token from cookies',
  provideTestCtx({}, {}, async (ctx) => {
    await logoutResolver(undefined, {}, ctx);
    expect(clearUserSessionTokenCookie).toBeCalledTimes(1);
  })
);

it(
  'should remove the user session from the database',
  provideTestCtx(
    { User: [STUDENT1], UserSession: [STUDENT1_SESSION] },
    {},
    async (ctx) => {
      appearLoggedIn(ctx, STUDENT1_SESSION.token, STUDENT1);

      // check that user session exists in db
      let userSession = await ctx.db.models.UserSession.findOne({
        where: { token: STUDENT1_SESSION.token },
      });
      expect(userSession).not.toBeNull();

      // do logout
      await logoutResolver(undefined, {}, ctx);

      // check that user session does not exist is db
      userSession = await ctx.db.models.UserSession.findOne({
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
    {},
    async (ctx) => {
      appearLoggedIn(ctx, STUDENT1_SESSION.token, STUDENT1);

      const { user } = await logoutResolver(undefined, {}, ctx);

      expect(user).not.toBeNull();
      expect(user!.id).toBe(STUDENT1.id);
    }
  )
);
