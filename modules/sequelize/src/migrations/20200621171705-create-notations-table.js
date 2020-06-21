module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE notations (
          id SERIAL PRIMARY KEY,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          song_name TEXT NOT NULL,
          artist_name TEXT NOT NULL,
          dead_time_ms integer DEFAULT 0 NOT NULL,
          duration_ms integer DEFAULT 0 NOT NULL,
          bpm decimal DEFAULT 120 NOT NULL,
          featured BOOLEAN default false NOT NULL,
          transcriber_id integer REFERENCES users (id) ON DELETE CASCADE
    );
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE notations;
    `);
  },
};
