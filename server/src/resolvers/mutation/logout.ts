import { FieldResolver } from '..';
import { LogoutPayloadType } from '../types';
import { clearAuthJwtCookie } from '../../util/auth-jwt/clearAuthJwtCookie';

export const logout: FieldResolver<LogoutPayloadType> = (parent, args, ctx) => {
  try {
    clearAuthJwtCookie(ctx.res);
    return { ok: true };
  } catch {
    return { ok: false };
  }
};
