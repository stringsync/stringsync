import { FixtureMap } from '.';
import { getTestDbProvider } from './getTestDbProvider';
import { getMockExpressContext } from './getMockExpressContext';
import { RequestContext, getRequestContextCreator } from '../request-context';
import { MockExpressContext, MockContextCreatorOptions } from './types';

type CtxCallback<A extends any[]> = (
  ctx: RequestContext<MockExpressContext>,
  ...args: A
) => any;

export const getTestCtxProvider = () => {
  const provideTestDb = getTestDbProvider();

  return <A extends any[]>(
    fixtureMap: FixtureMap,
    ctxOptions: MockContextCreatorOptions,
    callback: CtxCallback<A>
  ) => async (...args: A) => {
    await provideTestDb(fixtureMap, async (db) => {
      const expressCtx = getMockExpressContext({
        req: ctxOptions.req,
        res: ctxOptions.res,
      });

      const createRequestContext = getRequestContextCreator(db);
      const ctx = await createRequestContext(
        expressCtx,
        ctxOptions.requestedAt
      );

      await callback(ctx, ...args);
    })();
  };
};
