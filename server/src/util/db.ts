import { Sequelize } from 'sequelize';

// A singleton instance of a db connection using sequelize.
const db = new Sequelize({
  dialect: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
});

export default db;
