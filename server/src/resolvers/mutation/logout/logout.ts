import { clearUserSessionTokenCookie } from '../../../util/user-session';
import { toCanonicalUser } from '../../../data/db';
import { ReqCtx } from '../../../util/ctx';
import { LogoutPayload } from '../../../common/types';

interface Args {}

export const logout = async (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): Promise<LogoutPayload> => {
  clearUserSessionTokenCookie(ctx.res);

  if (!ctx.auth.user) {
    return { user: null };
  }

  await ctx.db.models.UserSession.destroy({ where: { token: ctx.auth.token } });

  return { user: toCanonicalUser(ctx.auth.user) };
};
