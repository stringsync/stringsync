import { CtxCallback, ReqCtxPatch } from './types';
import { getCookieStr } from './getCookieStr';
import { getMockExpressContext } from './getMockExpressContext';
import { getReqCtxFactory } from '../util/ctx';
import { useTestGlobalCtx } from './useTestGlobalCtx';

/**
 * The canonical way of creating a request context. All
 * changes will be rolled back after the test is done.
 */
export const useTestReqCtx = <A extends any[]>(
  patch: ReqCtxPatch,
  callback: CtxCallback<A>
) =>
  useTestGlobalCtx<A>(patch, async (globalCtx, ...args) => {
    const expressCtx = getMockExpressContext({
      req: {
        headers: {
          ...patch.headers,
          cookie: getCookieStr(patch.cookies || {}),
        },
      },
    });
    const createReqCtx = getReqCtxFactory(globalCtx);
    const reqCtx = await createReqCtx(expressCtx, patch.requestedAt);
    await callback(reqCtx, ...args);
  });
