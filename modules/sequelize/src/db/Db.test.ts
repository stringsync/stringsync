import { Db } from './Db';
import { Sequelize } from 'sequelize-typescript';
import { getContainerConfig } from '@stringsync/config';

const config = getContainerConfig();
let sequelize: Sequelize;

beforeEach(async () => {
  sequelize = Db.connect({
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
  });
});

afterEach(async () => {
  await Db.teardown(sequelize);
});

describe('cleanup', () => {
  it('runs without crashing', async () => {
    await Db.cleanup(sequelize);
  });
});
