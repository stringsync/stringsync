import { defineModels } from './defineModels';
import { Db, connectToDb } from '../db';
import { getContainerConfig } from '@stringsync/config';

let db: Db;
const config = getContainerConfig();

beforeEach(() => {
  db = connectToDb(config);
});

afterEach(async () => {
  jest.resetAllMocks();
  await db.sequelize.close();
});

it('runs without crashing', () => {
  expect(() => defineModels(db.sequelize)).not.toThrow();
});
