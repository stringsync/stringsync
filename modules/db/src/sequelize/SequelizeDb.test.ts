import { noop } from '@stringsync/common';
import { getContainerConfig } from '@stringsync/config';
import { SequelizeDb } from './SequelizeDb';

const config = getContainerConfig();
let db: SequelizeDb;

beforeEach(async () => {
  db = SequelizeDb.create({
    database: config.DB_NAME,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    logging: noop,
  });
});

afterEach(async () => {
  await db.teardown();
});

describe('cleanup', () => {
  it('runs without crashing', async () => {
    await db.cleanup();
  });
});
