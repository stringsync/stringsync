module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TYPE notation_statuses AS ENUM ('DRAFT', 'PUBLISHED');

      CREATE TABLE notations (
          id TEXT PRIMARY KEY,
          cursor SERIAL UNIQUE NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status notation_statuses DEFAULT 'DRAFT' NOT NULL,
          song_name TEXT,
          artist_name TEXT,
          dead_time_ms integer DEFAULT 0 NOT NULL,
          duration_ms integer DEFAULT 0 NOT NULL,
          private BOOLEAN default true NOT NULL,
          transcriber_id TEXT REFERENCES users (id) ON DELETE CASCADE,
          thumbnail_url TEXT,
          video_url TEXT
      );

      CREATE TRIGGER trigger_generate_notation_id BEFORE INSERT ON notations FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
      CREATE INDEX index_notations_on_transcriber_id ON notations (transcriber_id);
      CREATE INDEX index_notations_on_status ON notations (status);
      CREATE INDEX index_notations_on_cursor ON notations (cursor);
      CREATE INDEX trgm_index_notations_on_song_name ON notations USING GIN (song_name gin_trgm_ops);
      CREATE INDEX trgm_index_notations_on_artist_name ON notations USING GIN (artist_name gin_trgm_ops);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TYPE notation_statuses;

      DROP TABLE notations;

      DROP TRIGGER trigger_generate_notation_id ON notations;
      DROP INDEX index_notations_on_transcriber_id;
      DROP INDEX index_notations_on_status;
      DROP INDEX index_notations_on_cursor;
      DROP INDEX trgm_index_notations_on_song_name;
      DROP INDEX trgm_index_notations_on_song_name;
    `);
  },
};
