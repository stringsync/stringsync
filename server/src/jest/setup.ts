import { Sequelize } from 'sequelize';
import { createDb } from '../db/createDb';

const createDbConnection = () => {
  return new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '', 10),
  });
};

const main = async () => {
  const connection = createDbConnection();
  const db = createDb(connection);
  global.db = db;
};

main();
