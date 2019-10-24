import { FieldResolver } from '..';
import { LogoutPayload } from 'common/types';
import { clearUserSessionToken } from '../../modules/user-session/';

export const logout: FieldResolver<LogoutPayload> = (parent, args, ctx) => {
  clearUserSessionToken(ctx.res);
  return { user: ctx.auth.user };
};
