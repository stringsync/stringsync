import { CtxCallback, ReqCtxPatch } from './types';
import { getCookieStr } from './getCookieStr';
import { getMockExpressContext } from './getMockExpressContext';
import { getReqCtxCreator } from '../ctx';
import { useTestGlobalCtx } from './useTestGlobalCtx';

export const useTestReqCtx = <A extends any[]>(
  patch: ReqCtxPatch,
  callback: CtxCallback<A>
) =>
  useTestGlobalCtx<A>(patch, async (globalCtx, ...args) => {
    const expressCtx = getMockExpressContext({
      req: {
        headers: {
          cookie: getCookieStr(patch.cookies || {}),
        },
      },
    });
    const createReqCtx = getReqCtxCreator(globalCtx);
    const reqCtx = await createReqCtx(expressCtx, patch.requestedAt);
    await callback(reqCtx, ...args);
  });
