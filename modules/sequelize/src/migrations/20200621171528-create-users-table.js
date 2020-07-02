module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          username TEXT UNIQUE NOT NULL,
          encrypted_password TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          confirmation_token TEXT UNIQUE,
          confirmed_at TIMESTAMP,
          reset_password_token TEXT UNIQUE,
          reset_password_token_sent_at TIMESTAMP,
          avatar_url TEXT,
          role roles DEFAULT 'STUDENT'
      );

      CREATE TRIGGER trigger_generate_user_id BEFORE INSERT ON users FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE users;

      DROP TRIGGER trigger_generate_user_id ON users;
    `);
  },
};