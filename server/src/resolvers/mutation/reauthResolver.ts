import { ForbiddenError } from 'apollo-server';
import {
  createRawUserSession,
  toCanonicalUser,
  destroyUserSession,
} from '../../db';
import {
  setUserSessionTokenCookie,
  shouldRefreshUserSession,
} from '../../user-session';
import { RequestContext } from '../../request-context';

interface Args {}

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';

export const reauthResolver = async (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  const { isLoggedIn, user, token } = ctx.auth;

  if (!isLoggedIn || !user || !token) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  return ctx.db.transaction(async (transaction) => {
    const oldRawUserSession = await ctx.db.models.UserSession.findOne({
      raw: true,
      where: { token },
    });

    if (!oldRawUserSession) {
      throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
    }

    if (oldRawUserSession.expiresAt < ctx.requestedAt) {
      throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
    }

    if (shouldRefreshUserSession(ctx.requestedAt, oldRawUserSession.issuedAt)) {
      await destroyUserSession(ctx.db, oldRawUserSession.token);
      const rawUserSession = await createRawUserSession(
        ctx.db,
        user.id,
        ctx.requestedAt
      );
      setUserSessionTokenCookie(rawUserSession, ctx.res);
    }

    return { user: toCanonicalUser(user) };
  });
};
