const { MikroORM } = require('@mikro-orm/core');
const { getWorkerDbNames } = require('./workers');

// create worker dbs
module.exports = async () => {
  const orm = await MikroORM.init({
    type: 'postgresql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    dbName: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    discovery: {
      requireEntitiesArray: false,
      warnWhenNoEntities: false,
    },
  });

  const dbName = process.env.DB_NAME;
  const connection = orm.em.getConnection();
  const numWorkers = parseInt(process.env.JEST_NUM_WORKERS || '1');
  const workerDbNames = getWorkerDbNames(numWorkers);
  // only 1 user allowed to access main db at a time
  for (const workerDbName of workerDbNames) {
    await connection.execute(`DROP DATABASE IF EXISTS ${workerDbName}`);
    await connection.execute(`CREATE DATABASE ${workerDbName} TEMPLATE ${dbName}`);
  }

  await orm.close(true);
};
