import { Db, connectToDb } from '../db';
import { Config } from '../config';

type WithDbCleanupCallback = (db: Db) => Promise<any> | any;

/**
 * The canonnical way of accessing a db in a test environment.
 * Anything done in the callback will be rolled back, allowing
 * db tests to be hermetic.
 */
export const createTestDbProvider = (config: Config) => async (
  callback: WithDbCleanupCallback
): Promise<void> => {
  const db = connectToDb(config);
  const transaction = await db.transaction();
  try {
    callback(db);
  } catch (e) {
    console.error(e);
  }
  transaction.rollback();
};
