import { ForbiddenError } from 'apollo-server';
import { RequestContext } from '../request-context';

export const guardAuthenticated = (ctx: RequestContext) => {
  if (!ctx.auth.isLoggedIn) {
    throw new ForbiddenError('must be logged in');
  }
};
