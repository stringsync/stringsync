import { FieldResolver } from '..';
import { RefreshAuthPayloadType, RefreshAuthInputType } from '../types';
import { createJwt } from '../../util/createJwt';
import { ForbiddenError } from 'apollo-server';

interface Args {
  input: RefreshAuthInputType;
}

const BAD_JWT_MSG = 'invalid or expired credentials';

export const refreshAuth: FieldResolver<
  RefreshAuthPayloadType,
  undefined,
  Args
> = async (parent, args, ctx) => {
  // jwt expired or invalid
  if (!ctx.auth.isLoggedIn) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  // no user from the database (this should never happen because
  // of the isLoggedIn guard)
  if (!ctx.auth.user) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  // authenticated user is different from the user supplied
  if (ctx.auth.user.id !== args.input.id) {
    throw new ForbiddenError(BAD_JWT_MSG);
  }

  // if we got here, it means that the user has a valid jwt
  // and that jwt's id matches the one that the user provided
  const jwt = createJwt(ctx.auth.user.id, ctx.requestedAt);
  return { jwt };
};
