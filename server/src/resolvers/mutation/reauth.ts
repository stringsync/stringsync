import { FieldResolver } from '..';
import { ReauthPayload } from 'common/types';
import { ForbiddenError } from 'apollo-server';
import { createUserSession } from '../../db';
import {
  setUserSessionTokenCookie,
  shouldRefreshUserSession,
} from '../../user-session';

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';

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

    if (shouldRefreshUserSession(ctx.requestedAt, oldUserSession.issuedAt)) {
      await oldUserSession.destroy({ transaction });
      const userSessionModel = await createUserSession(
        ctx.db,
        user.id,
        ctx.requestedAt
      );
      setUserSessionTokenCookie(userSessionModel, ctx.res);
    }

    return { user };
  });
};
