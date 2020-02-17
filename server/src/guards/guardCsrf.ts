import { ReqCtx } from '../ctx';
import { CSRF_HEADER_NAME, convertCsrfToSession } from '../csrf';
import { ForbiddenError } from 'apollo-server';

const ERROR_MSG = 'invalid or missing csrf token';

export const guardCsrf = (ctx: ReqCtx) => {
  if (!(CSRF_HEADER_NAME in ctx.req.headers)) {
    throw new ForbiddenError(ERROR_MSG);
  }

  const csrfToken = ctx.req.headers[CSRF_HEADER_NAME];
  if (typeof csrfToken !== 'string') {
    throw new ForbiddenError(ERROR_MSG);
  }

  const sessionToken = convertCsrfToSession(csrfToken, ctx.config.CSRF_SECRET);
  if (sessionToken !== ctx.auth.token) {
    throw new ForbiddenError(ERROR_MSG);
  }
};
