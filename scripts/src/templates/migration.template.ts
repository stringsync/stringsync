import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    // Write migration code here.
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    // If migration fails, this will be called. Rollback your migration changes.
  },
};
