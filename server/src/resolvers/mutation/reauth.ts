import { FieldResolver } from '..';
import { ReauthPayloadType } from '../types';
import { ForbiddenError } from 'apollo-server';
import {
  createUserSession,
  setUserSessionTokenCookie,
} from '../../modules/user-session';

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';
// The token has to be at least 5 minutes old, or we might refresh too
// soon.
const MIN_REFRESH_AGE_MS = 1000 * 60 * 5;

export const reauth: FieldResolver<ReauthPayloadType> = async (
  parent,
  args,
  ctx
) => {
  const { isLoggedIn, user, token } = ctx.auth;

  if (!isLoggedIn) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  if (!user) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  return ctx.db.connection.transaction(async (transaction) => {
    const oldUserSession = await ctx.db.models.UserSession.findOne({
      where: { token },
      transaction,
    });
    if (!oldUserSession) {
      throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
    }

    const ageMs = oldUserSession.issuedAt.getTime() - ctx.requestedAt.getTime();
    if (ageMs < MIN_REFRESH_AGE_MS) {
      // Session token is still in grace period, but the
      // user is still valid. This is done to prevent
      // clearing a session token before the client receives
      // the new response.
      return { user };
    }

    ctx.db.models.UserSession.destroy({ where: { token }, transaction });
    const userSession = await createUserSession(user.id, ctx, transaction);
    setUserSessionTokenCookie(userSession, ctx);
    return { user };
  });
};
