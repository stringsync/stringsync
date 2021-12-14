import { MiddlewareFn } from 'type-graphql';
import { ResolverCtx } from '../types';

export const IsDataOwner: MiddlewareFn<ResolverCtx> = async (data, next) => {
  const user = data.context.getSessionUser();
  const isLoggedInAsDataOwner = user.isLoggedIn && user.id === data.root.id;
  return isLoggedInAsDataOwner;
};
