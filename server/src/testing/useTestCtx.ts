import { connectToRedis } from '../redis';
import { createLogger } from 'winston';
import { FixtureMap, CtxOptions, CtxCallback } from './types';
import { getConfig } from '../config';
import { getCookieStr } from './getCookieStr';
import { getMockExpressContext } from './getMockExpressContext';
import { getRequestContextCreator } from '../request-context';
import { useTestDb } from './useTestDb';
import { createGlobalCtx } from '../ctx';

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
    const config = getConfig(process.env);
    const globalCtx = createGlobalCtx(config);
    const createRequestContext = getRequestContextCreator(globalCtx);
    const ctx = await createRequestContext(expressCtx, ctxOpts.requestedAt);
    await callback(ctx, ...args);
  });
};
