import { clearUserSessionTokenCookie } from '../../user-session/';
import { toCanonicalUser } from '../../db';
import { ReqCtx } from '../../ctx';
import { LogoutPayload } from 'common/types';

interface Args {}

export const logoutResolver = async (
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
