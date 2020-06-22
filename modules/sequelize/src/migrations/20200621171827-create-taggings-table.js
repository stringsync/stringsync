module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE taggings (
          id TEXT PRIMARY KEY,
          notation_id TEXT REFERENCES notations (id) ON DELETE CASCADE,
          tag_id TEXT REFERENCES tags (id) ON DELETE CASCADE
      );

      CREATE TRIGGER trigger_generate_tagging_id BEFORE INSERT ON taggings FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
      CREATE INDEX index_taggings_on_notation_id ON taggings (notation_id);
      CREATE INDEX index_taggings_on_tag_id ON taggings (tag_id);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE taggings;
        
      DROP TRIGGER trigger_generate_tagging_id;
      DROP INDEX index_taggings_on_notation_id;
      DROP INDEX index_taggings_on_tag_id;
    `);
  },
};
