import { FieldResolver } from '..';
import { LogoutPayload } from 'common/types';
import { clearUserSessionTokenCookie } from '../../user-session/';
import { toUserPojo } from '../../db';

export const logout: FieldResolver<LogoutPayload> = (parent, args, ctx) => {
  clearUserSessionTokenCookie(ctx.res);
  const user = ctx.auth.user ? toUserPojo(ctx.auth.user) : null;
  return { user };
};
