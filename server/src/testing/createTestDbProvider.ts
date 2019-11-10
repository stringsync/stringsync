import { Db, connectToDb } from '../db';
import { Config } from '../config';
import { FixtureMap } from '../testing';
import { createFixtures } from './createFixtures';

type DbCallback<A extends any[]> = (db: Db, ...args: A) => Promise<any>;

class ForcedRollback extends Error {
  constructor() {
    super();
    this.name = 'ForcedRollback';
  }
}

/**
 * The canonnical way of accessing a db in a test environment.
 * Anything done in the callback will be rolled back, allowing
 * db tests to be hermetic.
 */
export const createTestDbProvider = (config: Config) => {
  const db = connectToDb(config);
  return <A extends any[]>(
    fixtureMap: FixtureMap,
    callback: DbCallback<A>
  ) => async (...args: A) => {
    try {
      await db.transaction(async () => {
        await createFixtures(db, fixtureMap);
        await callback(db, ...args);
        throw new ForcedRollback();
      });
    } catch (e) {
      if (e.name !== 'ForcedRollback') throw e;
    }
  };
};
