import { UseMiddleware } from 'type-graphql';
import { ForbiddenError } from '../../errors';
import { AuthRequirement } from '../../services';
import { Branch, Identity, Predicate, WithAuthRequirement, WithErrorHandler } from '../middlewares';
import { ResolverCtx } from '../types';

export const RestrictedField = (IsDataOwner: Predicate<ResolverCtx>) =>
  UseMiddleware(
    WithErrorHandler((err) => {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenError('must be logged in as data owner or admin');
      }
      throw err;
    }),
    Branch<ResolverCtx>(IsDataOwner, Identity, WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  );
