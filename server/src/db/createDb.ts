import { Sequelize } from 'sequelize';
import { ModelMap } from './models/defineModels';
import { defineModels } from './models/defineModels';

export interface Db {
  connection: Sequelize;
  models: ModelMap;
}

export const createDbConnection = () => {
  return new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432,
  });
};

export const createDb = (connection = createDbConnection()): Db => ({
  connection,
  models: defineModels(connection),
});
