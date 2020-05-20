import { clearUserSessionTokenCookie } from '../../../util/user-session';
import { toCanonicalUser } from '../../../data/db';
import { LogoutPayload } from '../../../common/types';
import { Resolver } from '../../types';

export const logout: Resolver<Promise<LogoutPayload>> = async (
  parent,
  args,
  ctx
) => {
  // clearUserSessionTokenCookie(ctx.res);

  if (!ctx.auth.user) {
    return { user: null };
  }

  await ctx.db.models.UserSession.destroy({ where: { token: ctx.auth.token } });

  return { user: toCanonicalUser(ctx.auth.user) };
};
