import { FieldResolver } from '..';
import { ReauthPayloadType } from '../types';
import { createAuthJwt } from '../../util/auth-jwt/createAuthJwt';
import { ForbiddenError } from 'apollo-server';
import { setAuthJwtCookie } from '../../util/auth-jwt/setAuthJwtCookie';

const BAD_JWT_MSG = 'invalid or expired credentials';

export const reauth: FieldResolver<ReauthPayloadType> = async (
  parent,
  args,
  ctx
) => {
  // jwt expired or invalid
  if (!ctx.auth.isLoggedIn) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  // no user from the database (this should never happen because
  // of the way isLoggedIn is computed)
  if (!ctx.auth.user) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  // if we got here, it means that the user has a valid jwt
  // and that jwt's id matches the one that the user provided
  const user = ctx.auth.user;
  const jwt = createAuthJwt(ctx.auth.user.id, ctx.requestedAt);
  setAuthJwtCookie(jwt, ctx.res);

  return { user };
};
