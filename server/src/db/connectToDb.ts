import { Sequelize } from 'sequelize';
import { defineModels } from './models';
import { Db } from './types';
import { Config } from '../modules/config';

export const connectToDb = (config: Config) => {
  const connection = new Sequelize({
    dialect: 'postgres',
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT, 10),
  });

  defineModels(connection);

  return connection as Db;
};
