import { FieldResolver } from '..';
import { ReauthPayload } from 'common/types';
import { ForbiddenError } from 'apollo-server';
import {
  createUserSession,
  setUserSessionTokenCookie,
} from '../../modules/user-session';

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';
const MIN_REFRESH_AGE_MS = 1000 * 60 * 5; // 5 minutes

export const reauth: FieldResolver<ReauthPayload> = async (
  parent,
  args,
  ctx
) => {
  const { isLoggedIn, user, token } = ctx.auth;

  if (!isLoggedIn || !user || !token) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  return ctx.db.transaction(async (transaction) => {
    const oldUserSession = await ctx.db.models.UserSession.findOne({
      where: { token },
      transaction,
    });
    if (!oldUserSession) {
      throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
    }

    const ageMs = ctx.requestedAt.getTime() - oldUserSession.issuedAt.getTime();
    if (ageMs >= MIN_REFRESH_AGE_MS) {
      oldUserSession.destroy();
      const userSession = await createUserSession(user.id, ctx, transaction);
      setUserSessionTokenCookie(userSession, ctx);
    }

    return { user };
  });
};
