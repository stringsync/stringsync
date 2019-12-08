import { ForbiddenError } from 'apollo-server';
import {
  createRawUserSession,
  toCanonicalUser,
  destroyUserSession,
  transaction,
  RawUserSession,
} from '../../db';
import {
  setUserSessionTokenCookie,
  shouldRefreshUserSession,
} from '../../user-session';
import { RequestContext } from '../../request-context';
import { ReauthPayload } from 'common/types';

interface Args {}

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';

export const reauthResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
): Promise<ReauthPayload> => {
  const { isLoggedIn, user, token } = ctx.auth;

  if (!isLoggedIn || !user || !token) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  const oldRawUserSession: RawUserSession | null = await ctx.db.models.UserSession.findOne(
    {
      raw: true,
      where: { token },
    }
  );

  if (!oldRawUserSession) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  if (oldRawUserSession.expiresAt < ctx.requestedAt) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  if (shouldRefreshUserSession(ctx.requestedAt, oldRawUserSession.issuedAt)) {
    await transaction(ctx.db, async () => {
      await destroyUserSession(ctx.db, oldRawUserSession.token);
      const rawUserSession = await createRawUserSession(
        ctx.db,
        user.id,
        ctx.requestedAt
      );
      setUserSessionTokenCookie(rawUserSession, ctx.res);
    });
  } else {
    // should be a noop, but we set it anyway for tests
    setUserSessionTokenCookie(oldRawUserSession, ctx.res);
  }

  return { user: toCanonicalUser(user) };
};
