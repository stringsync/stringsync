import { CtxCallback, GraphQLCtxPatch } from './types';
import { getCookieStr } from './getCookieStr';
import { getMockExpressContext } from './getMockExpressContext';
import { getReqCtxFactory } from '../util/ctx';
import { useTestGlobalCtx } from './useTestGlobalCtx';

/**
 * The canonical way of creating a request context. All
 * changes will be rolled back after the test is done.
 */
export const useTestReqCtx = <A extends any[]>(
  patch: GraphQLCtxPatch,
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
    const reqCtx = await createReqCtx(expressCtx, patch.reqAt);
    await callback(reqCtx, ...args);
  });
