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
import { isDataOwner } from './isDataOwner';
import { Resolver } from '../../../types';

export const middleware = compose(
  withErrorHandler((err) => {
    if (err instanceof ForbiddenError) {
      throw new ForbiddenError('must be logged in as data owner or admin');
    }
    throw err;
  }),
  branch(
    isDataOwner,
    identity,
    withAuthRequirement(AuthRequirements.LOGGED_IN_AS_ADMIN)
  )
);

export const resolver: Resolver<string, User> = (src, args, ctx, info) => {
  return src.email;
};

export const email = middleware(resolver);
