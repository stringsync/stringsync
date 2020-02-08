import { ForbiddenError } from 'apollo-server';
import { ReqCtx } from '../ctx';

export const guardAuthenticated = (ctx: ReqCtx) => {
  if (!ctx.auth.isLoggedIn) {
    throw new ForbiddenError('must be logged in');
  }
};
