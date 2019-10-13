module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      CREATE TABLE user_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id TEXT REFERENCES users(id)
      );
    `);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.sequelize.query(`
      DROP TABLE user_sessions;
    `);
  },
};
