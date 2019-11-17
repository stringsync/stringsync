import { clearUserSessionTokenCookie } from '../../user-session/';
import { toUserPojo } from '../../db';
import { RequestContext } from '../../request-context';

interface Args {}

export const resolveLogout = (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  clearUserSessionTokenCookie(ctx.res);
  const user = ctx.auth.user ? toUserPojo(ctx.auth.user) : null;
  return { user };
};
