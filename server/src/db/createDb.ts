import { Sequelize } from 'sequelize';
import { ModelMap } from './models/defineModels';
import { defineModels } from './models/defineModels';
import { Config } from '../getConfig';

export interface Db {
  connection: Sequelize;
  models: ModelMap;
}

export const createDb = (config: Config): Db => {
  const connection = new Sequelize({
    dialect: 'postgres',
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT, 10),
  });

  return {
    connection,
    models: defineModels(connection),
  };
};
