import { ReqCtx } from '../../../ctx';
import jwt from 'jsonwebtoken';
import { CsrfTokenPayload } from '../../../csrf';

interface Args {}

export const getCsrfToken = (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): string => {
  const payload: CsrfTokenPayload = {
    sessionToken: '',
    issuedAt: ctx.requestedAt,
  };

  if (ctx.auth.isLoggedIn) {
    payload.sessionToken = ctx.auth.token;
  }

  return jwt.sign(JSON.stringify(payload), ctx.config.CSRF_SECRET);
};
