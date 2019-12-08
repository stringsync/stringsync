const { execSync } = require('child_process');

const resetDb = async () => {
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
    console.error('could not reset db, running tests anyway');
    console.error(e);
  }
};

module.exports = resetDb;
