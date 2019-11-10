import { Db, connectToDb } from '../db';
import { Config } from '../config';
import { FixtureMap } from '../testing';
import { createFixtures } from './createFixtures';

type WithDbCleanupCallback = (db: Db) => Promise<any> | any;

/**
 * The canonnical way of accessing a db in a test environment.
 * Anything done in the callback will be rolled back, allowing
 * db tests to be hermetic.
 */
export const createTestDbProvider = (config: Config) => {
  const db = connectToDb(config);
  return async (
    fixtureMap: FixtureMap,
    callback: WithDbCleanupCallback
  ): Promise<void> => {
    const transaction = await db.transaction();
    await createFixtures(db, fixtureMap);
    try {
      callback(db);
    } catch (e) {
      console.error(e);
    }
    transaction.rollback();
  };
};
