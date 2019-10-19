import { FieldResolver } from '..';
import { ReauthPayloadType } from '../types';
import { ForbiddenError } from 'apollo-server';
import {
  createUserSession,
  setUserSessionTokenCookie,
  USER_SESSION_TOKEN_MAX_AGE_MS,
} from '../../modules/user-session';

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';
const MIN_REFRESH_AGE_MS = USER_SESSION_TOKEN_MAX_AGE_MS / 2;

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

    const ageMs = ctx.requestedAt.getTime() - oldUserSession.issuedAt.getTime();
    console.log(ageMs);
    if (ageMs < MIN_REFRESH_AGE_MS) {
      // Session token is still in grace period, so avoid
      // making database changes until we're sure that
      // the user has the last session token.
      return { user };
    }

    oldUserSession.destroy();
    const userSession = await createUserSession(user.id, ctx, transaction);
    setUserSessionTokenCookie(userSession, ctx);
    return { user };
  });
};
