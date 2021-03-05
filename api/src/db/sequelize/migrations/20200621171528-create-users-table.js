module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TYPE user_roles AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');

      CREATE TABLE users (
          id TEXT PRIMARY KEY,
          cursor SERIAL UNIQUE NOT NULL,
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
          role user_roles DEFAULT 'STUDENT'
      );

      CREATE TRIGGER trigger_generate_user_id BEFORE INSERT ON users FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
      CREATE INDEX index_users_on_cursor ON users (cursor);
      CREATE INDEX index_users_on_email ON users (email);
      CREATE INDEX index_users_on_reset_password_token ON users (reset_password_token);
      CREATE INDEX trgm_index_users_on_username ON users USING GIN (username gin_trgm_ops);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TYPE user_roles;

      DROP TABLE users;

      DROP TRIGGER trigger_generate_user_id ON users;
      DROP INDEX index_users_on_cursor;
      DROP INDEX index_users_on_cursor;
      DROP INDEX index_users_on_email;
      DROP INDEX index_users_on_username;
      DROP INDEX index_users_on_reset_password_token;
      DROP INDEX trgm_index_users_on_username;
    `);
  },
};
