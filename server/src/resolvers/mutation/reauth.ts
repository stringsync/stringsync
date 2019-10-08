import { FieldResolver } from '..';
import { ReauthPayloadType } from '../types';
import {
  createJwt,
  JWT_COOKIE_NAME,
  JWT_MAX_AGE_MS,
} from '../../util/createJwt';
import { ForbiddenError } from 'apollo-server';

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
  const jwt = createJwt(ctx.auth.user.id, ctx.requestedAt);
  const user = ctx.auth.user;

  ctx.res.cookie(JWT_COOKIE_NAME, jwt, {
    httpOnly: true,
    maxAge: JWT_MAX_AGE_MS,
  });

  return { user };
};
