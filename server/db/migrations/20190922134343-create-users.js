module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TYPE roles AS ENUM ('student', 'teacher', 'admin');

      CREATE TABLE users (
        id serial PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        encrypted_password TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        confirmation_token TEXT UNIQUE,
        confirmed_at TIMESTAMP,
        reset_password_token TEXT UNIQUE,
        reset_password_sent_at TIMESTAMP,
        avatar_url TEXT,
        role roles DEFAULT 'student'
      );

      CREATE INDEX index_users_on_confirmation_token ON users(confirmation_token);
      CREATE INDEX index_users_on_reset_password_token ON users(reset_password_token);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE users;
    `);
  },
};
