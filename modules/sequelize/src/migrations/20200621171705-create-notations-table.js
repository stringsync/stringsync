module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE notations (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          song_name TEXT NOT NULL,
          artist_name TEXT NOT NULL,
          dead_time_ms integer DEFAULT 0 NOT NULL,
          duration_ms integer DEFAULT 0 NOT NULL,
          bpm decimal DEFAULT 120 NOT NULL,
          featured BOOLEAN default false NOT NULL,
          transcriber_id TEXT REFERENCES users (id) ON DELETE CASCADE
      );

      CREATE TRIGGER trigger_generate_notation_id BEFORE INSERT ON notations FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
      CREATE INDEX index_notations_on_rank ON notations (rank);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE notations;

      DROP TRIGGER trigger_generate_notation_id ON notations;
      DROP INDEX index_notations_on_rank;
    `);
  },
};
