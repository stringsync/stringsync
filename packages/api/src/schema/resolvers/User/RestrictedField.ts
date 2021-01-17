import { Branch } from '../../middlewares/Branch';
import { Identity } from '../../middlewares/Identity';
import { WithAuthRequirement, WithErrorHandler } from '../../middlewares';
import { AuthRequirement, ForbiddenError } from '@stringsync/common';
import { UseMiddleware } from 'type-graphql';
import { Predicate } from '../../middlewares/types';
import { ReqCtx } from '../../../ctx';

export const RestrictedField = (IsDataOwner: Predicate<ReqCtx>) =>
  UseMiddleware(
    WithErrorHandler((err) => {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenError('must be logged in as data owner or admin');
      }
      throw err;
    }),
    Branch(IsDataOwner, Identity, WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  );
