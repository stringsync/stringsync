import { FieldResolver } from '..';
import { ReauthPayloadType } from '../types';
import { ForbiddenError } from 'apollo-server';
import {
  getExpiresAtDetails,
  setUserSessionToken,
} from '../../modules/user-session-token';

const BAD_JWT_MSG = 'invalid or expired credentials';

export const reauth: FieldResolver<ReauthPayloadType> = async (
  parent,
  args,
  ctx
) => {
  if (!ctx.auth.isLoggedIn) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  if (!ctx.auth.user) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  const user = ctx.auth.user;
  const { expiresAt, maxAgeMs } = getExpiresAtDetails(ctx.requestedAt);

  return ctx.db.connection.transaction(async (transaction) => {
    ctx.db.models.UserSession.destroy({
      where: { token: ctx.auth.token },
      transaction,
    });
    const userSession = await ctx.db.models.UserSession.create(
      {
        expiresAt,
        userId: user.id,
      },
      { transaction }
    );
    setUserSessionToken(userSession, maxAgeMs, ctx.res);
    return { user };
  });
};
