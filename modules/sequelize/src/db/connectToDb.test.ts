import { connectToDb } from './connectToDb';
import { Db } from './types';
import { getContainerConfig } from '@stringsync/config';

let db: Db | undefined;

afterEach(async () => {
  if (db) {
    await db.sequelize.close();
  }
  db = undefined;
});

it('connects to the db', async () => {
  const config = getContainerConfig();

  db = connectToDb(config);

  await expect(db.sequelize.authenticate()).resolves.not.toThrow();
});
