const { execSync } = require('child_process');

const MAX_NUM_RETRIES = 5;

const resetDb = async (numRetries = 0) => {
  const env = process.env.NODE_ENV;
  if (env !== 'test') {
    throw new Error(`cannot run jest setup in NODE_ENV=${env || ''}`);
  }

  // `yarn tsc:db` is called in pretest script
  try {
    execSync('yarn sequelize db:drop');
    execSync('yarn sequelize db:create');
    execSync('yarn sequelize db:migrate');
  } catch (e) {
    if (numRetries >= MAX_NUM_RETRIES) {
      throw e;
    }
    console.error(e);
    await setTimeout(() => {}, 1000);
    resetDb(numRetries + 1);
  }
};

module.exports = resetDb;
