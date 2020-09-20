import { MiddlewareFn } from 'type-graphql';
import { ReqCtx } from '../../../ctx';

export const IsDataOwner: MiddlewareFn<ReqCtx> = async (data, next) => {
  const user = data.context.req.session.user;
  const isLoggedInAsDataOwner = user.isLoggedIn && user.id === data.root.id;
  return isLoggedInAsDataOwner;
};
