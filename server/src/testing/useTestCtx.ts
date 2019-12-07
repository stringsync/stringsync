import { getMockExpressContext } from './getMockExpressContext';
import { getRequestContextCreator } from '../request-context';
import { FixtureMap, MockContextCreatorOptions, CtxCallback } from './types';
import { useTestDb } from './useTestDb';

export const useTestCtx = <A extends any[]>(
  fixtureMap: FixtureMap,
  ctxOpts: MockContextCreatorOptions,
  callback: CtxCallback<A>
) => {
  return useTestDb<A>(fixtureMap, async (db, ...args) => {
    const { req, res, requestedAt } = ctxOpts;
    const expressCtx = getMockExpressContext({ req, res });
    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(expressCtx, requestedAt);
    await callback(ctx, ...args);
  });
};
