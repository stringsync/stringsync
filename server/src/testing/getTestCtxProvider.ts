import { FixtureMap } from '.';
import { getTestDbProvider } from './getTestDbProvider';
import { getMockExpressContext } from './getMockExpressContext';
import { RequestContext, getRequestContextCreator } from '../request-context';

type CtxCallback<A extends any[]> = (ctx: RequestContext, ...args: A) => any;

export const getTestCtxProvider = () => {
  const provideTestDb = getTestDbProvider();
  return <A extends any[]>(
    fixtureMap: FixtureMap,
    callback: CtxCallback<A>
  ) => async (...args: A) => {
    await provideTestDb(fixtureMap, async (db) => {
      const createRequestContext = getRequestContextCreator(db);
      const ctx = await createRequestContext(getMockExpressContext());
      await callback(ctx, ...args);
    })();
  };
};
