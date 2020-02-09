import { FixtureMap } from '.';
import { Db, connectToDb, transaction } from '../db';
import { getConfig } from '../config';
import { createFixtures } from './createFixtures';

type DbCallback<A extends any[]> = (db: Db, ...args: A) => Promise<any>;

class ForcedRollback extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ForcedRollback.prototype);
  }
}

/**
 * The canonical way of accessing a db in a test environment.
 * Anything done in the callback will be rolled back, allowing
 * db tests to be hermetic.
 */
export const useTestDb = <A extends any[]>(
  fixtureMap: FixtureMap,
  callback: DbCallback<A>
) => async (...args: A) => {
  const config = getConfig(process.env);
  const db = connectToDb(config, false);
  try {
    await transaction(db, async () => {
      await createFixtures(db, fixtureMap);
      await callback(db, ...args);
      throw new ForcedRollback();
    });
  } catch (e) {
    await db.close();
    if (!(e instanceof ForcedRollback)) throw e;
  }
};
