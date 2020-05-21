import { toCanonicalUser, transaction } from '../../data/db';
import { GraphQLCtx } from '../../util/ctx';
import { AuthenticateOutput } from '../../common';
import { IFieldResolver } from 'graphql-tools';

const BAD_SESSION_TOKEN_MSG = 'invalid or expired credentials';

type AuthenticateResolver = IFieldResolver<undefined, GraphQLCtx, {}>;

export const authenticate: AuthenticateResolver = async (
  src,
  args,
  ctx
): Promise<AuthenticateOutput> => {
  const { isLoggedIn, user, token } = ctx.auth;

  if (!isLoggedIn || !user || !token) {
    throw new Error(BAD_SESSION_TOKEN_MSG);
  }

  const oldUserSessionModel = await ctx.db.models.UserSession.findOne({
    where: { token },
  });

  if (!oldUserSessionModel) {
    throw new Error(BAD_SESSION_TOKEN_MSG);
  }

  if (oldUserSessionModel.expiresAt < ctx.reqAt) {
    throw new Error(BAD_SESSION_TOKEN_MSG);
  }

  // if (shouldRefreshUserSession(ctx.reqAt, oldUserSessionModel.issuedAt)) {
  //   await transaction(ctx.db, async () => {
  //     await oldUserSessionModel.destroy();
  //     const newUserSessionModel = await ctx.db.models.UserSession.create({
  //       issuedAt: ctx.reqAt,
  //       userId: user.id,
  //       expiresAt: getExpiresAt(ctx.reqAt),
  //     });
  //     // setUserSessionTokenCookie(newUserSessionModel, ctx.res);
  //   });
  // } else {
  //   // should be a noop, but we set it anyway for tests
  //   // setUserSessionTokenCookie(oldUserSessionModel, ctx.res);
  // }

  return { user: toCanonicalUser(user) };
};
