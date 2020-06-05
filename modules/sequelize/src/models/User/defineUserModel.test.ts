import { defineUserModel } from './defineUserModel';
import { Db, connectToDb } from '../../db';
import { getContainerConfig } from '@stringsync/config';

let db: Db;
const config = getContainerConfig();

beforeEach(() => {
  db = connectToDb(config);
});

afterEach(async () => {
  await db.sequelize.close();
});

it('defines the user model on a sequelize instance', () => {
  const UserModel = defineUserModel(db.sequelize);

  const models = Object.values(db.sequelize.models);
  expect(models.includes(UserModel)).toBe(true);
});
