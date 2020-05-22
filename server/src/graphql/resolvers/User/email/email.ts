import {
  compose,
  AuthRequirements,
  User,
  ForbiddenError,
} from '../../../../common';
import {
  withAuthRequirement,
  branch,
  identity,
  withErrorHandler,
} from '../../../middlewares';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../../util/ctx';
import { canAccessEmail } from './canAccessEmail';

export const middleware = compose(
  withErrorHandler((err) => {
    console.log(err.constructor);
    if (err instanceof ForbiddenError) {
      throw new ForbiddenError('must be logged in as data owner or admin');
    }
    throw err;
  }),
  branch(
    canAccessEmail,
    identity,
    withAuthRequirement(AuthRequirements.LOGGED_IN_AS_ADMIN)
  )
);

export const resolver: IFieldResolver<User, ResolverCtx> = (
  src,
  args,
  ctx,
  info
) => {
  return src.email;
};

export const email = middleware(resolver);
