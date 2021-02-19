const { Sequelize } = require('sequelize');
const { getWorkerDbNames } = require('./workers');

module.exports = async () => {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    // logging: false,
  });

  // create worker dbs
  const dbName = sequelize.getDatabaseName();
  const numWorkers = parseInt(process.env.JEST_WORKERS || '1');
  console.log('numWorkers', process.env.JEST_WORKERS);
  const workerDbNames = getWorkerDbNames(numWorkers);
  // only 1 user allowed to access main db at a time
  for (const workerDbName of workerDbNames) {
    await sequelize.query(`DROP DATABASE IF EXISTS ${workerDbName}`);
    await sequelize.query(`CREATE DATABASE ${workerDbName} TEMPLATE ${dbName}`);
  }

  await sequelize.close();
};
