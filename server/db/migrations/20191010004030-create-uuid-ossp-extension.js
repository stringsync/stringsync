module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      DROP EXTENSION "uuid-ossp";
    `);
  },
};
