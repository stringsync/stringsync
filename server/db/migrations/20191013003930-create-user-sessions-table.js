module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      CREATE TABLE user_sessions (
        user_session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id TEXT REFERENCES users(user_id)
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      DROP TABLE user_sessions;
    `);
  },
};
