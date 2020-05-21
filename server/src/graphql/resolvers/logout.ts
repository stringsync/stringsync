import { toCanonicalUser } from '../../data/db';
import { LogoutOutput } from '../../common/';
import { IFieldResolver } from 'graphql-tools';
import { GraphQLCtx } from '../../util/ctx';

type LogoutResolver = IFieldResolver<undefined, GraphQLCtx, {}>;

export const logout: LogoutResolver = async (
  src,
  args,
  ctx
): Promise<LogoutOutput> => {
  // clearUserSessionTokenCookie(ctx.res);

  if (!ctx.auth.user) {
    return { user: null };
  }

  await ctx.db.models.UserSession.destroy({ where: { token: ctx.auth.token } });

  return { user: toCanonicalUser(ctx.auth.user) };
};
