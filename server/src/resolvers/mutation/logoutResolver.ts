import { clearUserSessionTokenCookie } from '../../user-session/';
import { toCanonicalUser } from '../../db';
import { RequestContext } from '../../request-context';

interface Args {}

export const logoutResolver = (
  parent: undefined,
  args: Args,
  ctx: RequestContext
) => {
  clearUserSessionTokenCookie(ctx.res);
  const user = ctx.auth.user ? toCanonicalUser(ctx.auth.user) : null;
  return { user };
};
