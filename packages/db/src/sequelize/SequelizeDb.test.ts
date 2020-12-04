import { noop } from '@stringsync/common';
import { getDbConfig } from '@stringsync/config';
import { SequelizeDb } from './SequelizeDb';

const config = getDbConfig();
let db: SequelizeDb;

beforeEach(async () => {
  db = SequelizeDb.create({
    env: 'test',
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
