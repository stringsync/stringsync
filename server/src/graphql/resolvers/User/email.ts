import {
  compose,
  AuthRequirements,
  User,
  ForbiddenError,
} from '../../../common';
import { withAuthRequirement, withErrorHandler } from '../../middlewares';
import { IFieldResolver } from 'graphql-tools';
import { ResolverCtx } from '../../../util/ctx';

export const middleware = compose(withAuthRequirement(AuthRequirements.NONE));

export const resolver: IFieldResolver<User, ResolverCtx> = (
  src,
  args,
  ctx,
  info
) => {
  return src.email;
};

export const email = middleware(resolver);
