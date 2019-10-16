import { QueryInterface } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface, Sequelize: any) => {
    queryInterface.sequelize.query(`
      CREATE TABLE user_sessions (
        id SERIAL PRIMARY KEY,
        token UUID DEFAULT uuid_generate_v4(),
        user_id TEXT REFERENCES users(id)
      );

      CREATE INDEX index_user_sessions_on_token ON user_sessions(token);
      CREATE INDEX index_user_sessions_on_user_id ON user_sessions(user_id);
    `);
  },

  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    queryInterface.sequelize.query(`
      DROP TABLE user_sessions;

      DROP INDEX index_user_sessions_on_token;
      DROP INDEX index_user_sessions_on_user_id;
    `);
  },
};
