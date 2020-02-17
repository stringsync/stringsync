import { ReqCtx } from '../../../ctx';
import { CsrfTokenPayload, convertSessionToCsrf } from '../../../csrf';

interface Args {}

export const getCsrfToken = (
  parent: undefined,
  args: Args,
  ctx: ReqCtx
): string => convertSessionToCsrf(ctx.auth.token, ctx.config.CSRF_SECRET);
