import { FixtureMap } from '.';
import { getTestDbProvider } from './getTestDbProvider';
import { getMockExpressContext } from './getMockExpressContext';
import { RequestContext, getRequestContextCreator } from '../request-context';
import { ExpressContextOptions } from './types';

type CtxCallback<A extends any[]> = (ctx: RequestContext, ...args: A) => any;

export const getTestCtxProvider = () => {
  const provideTestDb = getTestDbProvider();
  return <A extends any[]>(
    fixtureMap: FixtureMap,
    expressCtxOptions: ExpressContextOptions,
    callback: CtxCallback<A>
  ) => async (...args: A) => {
    await provideTestDb(fixtureMap, async (db) => {
      const expressCtx = getMockExpressContext(expressCtxOptions);
      const createRequestContext = getRequestContextCreator(db);
      const ctx = await createRequestContext(expressCtx);
      await callback(ctx, ...args);
    })();
  };
};
