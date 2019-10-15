import { QueryInterface } from 'sequelize/types';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    queryInterface.sequelize.query(`
      CREATE TABLE user_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id TEXT REFERENCES users(id)
      );
    `);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    queryInterface.sequelize.query(`
      DROP TABLE user_sessions;
    `);
  },
};
