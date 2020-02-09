import { reauthResolver } from './reauthResolver';
import { useTestReqCtx, getFixtures } from '../../testing';
import { shouldRefreshUserSession } from '../../user-session/shouldRefreshUserSession';

jest.mock('../../user-session/shouldRefreshUserSession', () => ({
  shouldRefreshUserSession: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;
const USER_SESSION_TOKEN = USER_SESSION.token;

it(
  'throws an error when not logged in',
  useTestReqCtx({}, async (ctx) => {
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'throws an error when user session does not exist',
  useTestReqCtx({ fixtures: { User: [USER] } }, async (ctx) => {
    await expect(reauthResolver(undefined, {}, ctx)).rejects.toThrowError(
      'invalid or expired credentials'
    );
  })
);

it(
  'does not throw an error when user session exists',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      await expect(reauthResolver(undefined, {}, ctx)).resolves.not.toThrow();
    }
  )
);

it(
  'destroy the old session token if it should refresh',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      (shouldRefreshUserSession as jest.Mock).mockReturnValueOnce(true);

      await reauthResolver(undefined, {}, ctx);

      const userSession = await ctx.db.models.UserSession.findOne({
        where: { token: USER_SESSION_TOKEN },
      });
      expect(userSession).toBeNull();
    }
  )
);

it(
  'creates a new session token if it should refresh',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      (shouldRefreshUserSession as jest.Mock).mockReturnValueOnce(true);

      await reauthResolver(undefined, {}, ctx);

      const userSessions = await ctx.db.models.UserSession.findAll();
      expect(userSessions).toHaveLength(1);
      const userSession = userSessions[0];
      expect(userSession.token).not.toBe(USER_SESSION_TOKEN);
    }
  )
);

it(
  'sets the new session token in the cookies',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      (shouldRefreshUserSession as jest.Mock).mockReturnValueOnce(true);

      await reauthResolver(undefined, {}, ctx);

      const userSession = await ctx.db.models.UserSession.findOne({
        where: { userId: USER.id },
      });
      expect(userSession).not.toBeNull();
      expect(ctx.res.cookies['USER_SESSION_TOKEN'].value).toBe(
        userSession!.token
      );
    }
  )
);

it(
  'does not destroy the user session if it should not refresh',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      (shouldRefreshUserSession as jest.Mock).mockReturnValueOnce(false);

      await reauthResolver(undefined, {}, ctx);

      const userSession = await ctx.db.models.UserSession.findOne({
        where: { token: USER_SESSION_TOKEN },
      });
      expect(userSession).not.toBeNull();
    }
  )
);

it(
  'keeps the user session token in the cookies if it should not refresh',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      (shouldRefreshUserSession as jest.Mock).mockReturnValueOnce(false);

      await reauthResolver(undefined, {}, ctx);

      expect(ctx.res.cookies['USER_SESSION_TOKEN'].value).toBe(
        USER_SESSION_TOKEN
      );
    }
  )
);

it(
  'returns the logged in user',
  useTestReqCtx(
    {
      fixtures: { User: [USER], UserSession: [USER_SESSION] },
      requestedAt: USER_SESSION.issuedAt,
      cookies: { USER_SESSION_TOKEN },
    },
    async (ctx) => {
      const reauthPayload = await reauthResolver(undefined, {}, ctx);

      expect(reauthPayload.user.id).toBe(USER.id);
    }
  )
);
