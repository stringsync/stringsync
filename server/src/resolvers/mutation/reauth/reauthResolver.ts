import { ForbiddenError } from 'apollo-server';
import { toCanonicalUser, transaction } from '../../../db';
import {
  setUserSessionTokenCookie,
  shouldRefreshUserSession,
  getExpiresAt,
} from '../../../user-session';
import { ReqCtx } from '../../../ctx';
import { ReauthPayload } from 'common/types';

interface Args {}

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';

export const reauthResolver = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): Promise<ReauthPayload> => {
  const { isLoggedIn, user, token } = ctx.auth;

  if (!isLoggedIn || !user || !token) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  const oldUserSessionModel = await ctx.db.models.UserSession.findOne({
    where: { token },
  });

  if (!oldUserSessionModel) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  if (oldUserSessionModel.expiresAt < ctx.requestedAt) {
    throw new ForbiddenError(BAD_SESSION_TOKEN_MSG);
  }

  if (shouldRefreshUserSession(ctx.requestedAt, oldUserSessionModel.issuedAt)) {
    await transaction(ctx.db, async () => {
      await oldUserSessionModel.destroy();
      const newUserSessionModel = await ctx.db.models.UserSession.create({
        issuedAt: ctx.requestedAt,
        userId: user.id,
        expiresAt: getExpiresAt(ctx.requestedAt),
      });
      setUserSessionTokenCookie(newUserSessionModel, ctx.res);
    });
  } else {
    // should be a noop, but we set it anyway for tests
    setUserSessionTokenCookie(oldUserSessionModel, ctx.res);
  }

  return { user: toCanonicalUser(user) };
};
