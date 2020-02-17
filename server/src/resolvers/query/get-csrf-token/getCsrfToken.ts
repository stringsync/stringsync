import { ReqCtx } from '../../../ctx';
import { CsrfTokenPayload, encryptCsrfToken } from '../../../csrf';

interface Args {}

export const getCsrfToken = (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): string => {
  const payload: CsrfTokenPayload = {
    session: ctx.auth.token,
    iat: ctx.requestedAt,
  };

  return encryptCsrfToken(payload, ctx.config.CSRF_SECRET);
};
