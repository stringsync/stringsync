import { Config } from '../modules/config';
import { Sequelize } from 'sequelize';

export const createDbConnection = (config: Config) => {
  return new Sequelize({
    dialect: 'postgres',
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT, 10),
  });
};
