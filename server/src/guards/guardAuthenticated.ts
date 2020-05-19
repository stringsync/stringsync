import { ReqCtx } from '../ctx';

export const guardAuthenticated = (ctx: ReqCtx) => {
  if (!ctx.auth.isLoggedIn) {
    throw new Error('must be logged in');
  }
};
