import { FieldResolver } from '..';
import { LogoutPayloadType } from '../types';
import { JWT_COOKIE_NAME } from '../../util/createJwt';

export const logout: FieldResolver<LogoutPayloadType> = (parent, args, ctx) => {
  ctx.res.clearCookie(JWT_COOKIE_NAME);
  return { ok: true };
};
