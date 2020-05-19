import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    queryInterface.sequelize.query(`
      DROP EXTENSION "uuid-ossp";
    `);
  },
};
