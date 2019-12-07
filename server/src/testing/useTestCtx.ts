import { getMockExpressContext } from './getMockExpressContext';
import { getRequestContextCreator } from '../request-context';
import { FixtureMap, CtxOptions, CtxCallback } from './types';
import { useTestDb } from './useTestDb';
import { getCookieStr } from './getCookieStr';

export const useTestCtx = <A extends any[]>(
  fixtureMap: FixtureMap,
  ctxOpts: CtxOptions,
  callback: CtxCallback<A>
) => {
  return useTestDb<A>(fixtureMap, async (db, ...args) => {
    const expressCtx = getMockExpressContext({
      req: {
        headers: {
          cookie: getCookieStr(ctxOpts.cookies || {}),
        },
      },
    });
    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(expressCtx, ctxOpts.requestedAt);
    await callback(ctx, ...args);
  });
};
