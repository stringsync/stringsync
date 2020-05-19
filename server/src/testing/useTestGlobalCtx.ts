import { GlobalCtxPatch, DbCallback, GlobalCtxCallback } from './types';
import { getConfig } from '../config';
import { createGlobalCtx } from '../util/ctx';
import { transaction } from '../data/db';
import { createFixtures } from './createFixtures';
import { ForcedRollback } from './ForcedRollback';
import { cleanup } from './cleanup';

/**
 * The canonical way of accessing the global ctx in a test environment.
 * Anything done in the callback will be rolled back, allowing tests to
 * be hermetic.
 */
export const useTestGlobalCtx = <A extends any[]>(
  patch: GlobalCtxPatch,
  callback: GlobalCtxCallback<A>
) => async (...args: A) => {
  const config = { ...getConfig(process.env), ...patch.config };
  const globalCtx = createGlobalCtx(config);
  const { db, queues, redis } = globalCtx;

  try {
    await transaction(db, async () => {
      await createFixtures(db, patch.fixtures || {});
      await callback(globalCtx, ...args);
      throw new ForcedRollback();
    });
  } catch (e) {
    cleanup({ db, redis, queues });
    if (!(e instanceof ForcedRollback)) throw e;
  }
};
