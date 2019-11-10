import { Sequelize } from 'sequelize';
import { defineModels } from './models';
import { Db } from './types';
import { Config } from '../modules/config';
import { TRANSACTION_NAMESPACE } from './constants';

export const connectToDb = (config: Config) => {
  Sequelize.useCLS(TRANSACTION_NAMESPACE);

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
