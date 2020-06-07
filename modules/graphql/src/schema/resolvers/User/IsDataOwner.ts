import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../../types';
import { ForbiddenError } from '@stringsync/common';

export const IsDataOwner: MiddlewareFn<ResolverCtx> = async (data, next) => {
  const user = data.context.req.session.user;

  const isLoggedInAsDataOwner = user.isLoggedIn && user.id === data.root.id;

  if (!isLoggedInAsDataOwner) {
    throw new ForbiddenError('must be logged in as data owner');
  }

  return next();
};
