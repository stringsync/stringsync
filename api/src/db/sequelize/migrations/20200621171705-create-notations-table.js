module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE notations (
          id TEXT PRIMARY KEY,
          cursor SERIAL UNIQUE NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          song_name TEXT NOT NULL,
          artist_name TEXT NOT NULL,
          dead_time_ms integer DEFAULT 0 NOT NULL,
          duration_ms integer DEFAULT 0 NOT NULL,
          featured BOOLEAN default false NOT NULL,
          transcriber_id TEXT REFERENCES users (id) ON DELETE CASCADE,
          thumbnail_url TEXT,
          video_url TEXT
      );

      CREATE TRIGGER trigger_generate_notation_id BEFORE INSERT ON notations FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
      CREATE INDEX index_notations_on_transcriber_id ON notations (transcriber_id);
      CREATE INDEX index_notations_on_cursor ON notations (cursor);
      CREATE INDEX trgm_index_notations_on_song_name ON notations USING GIN (song_name gin_trgm_ops);
      CREATE INDEX trgm_index_notations_on_artist_name ON notations USING GIN (artist_name gin_trgm_ops);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE notations;

      DROP TRIGGER trigger_generate_notation_id ON notations;
      DROP INDEX index_notations_on_transcriber_id ON notations;
      DROP INDEX index_notations_on_cursor;
      DROP INDEX trgm_index_notations_on_song_name;
      DROP INDEX trgm_index_notations_on_song_name;
    `);
  },
};
