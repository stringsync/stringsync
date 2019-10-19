import { FieldResolver } from '..';
import { LogoutPayloadType } from '../types';
import { clearUserSessionToken } from '../../modules/user-session/';

export const logout: FieldResolver<LogoutPayloadType> = (parent, args, ctx) => {
  try {
    clearUserSessionToken(ctx.res);
    return { ok: true };
  } catch {
    return { ok: false };
  }
};
