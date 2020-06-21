module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE taggings (
          id SERIAL PRIMARY KEY,
          notation_id integer REFERENCES notations (id) ON DELETE CASCADE,
          tag_id integer REFERENCES tags (id) ON DELETE CASCADE
      );

      CREATE INDEX index_taggings_on_notation_id ON taggings (notation_id);
      CREATE INDEX index_taggings_on_tag_id ON taggings (tag_id);
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE taggings;
        
      DROP INDEX index_taggings_on_notation_id;
      DROP INDEX index_taggings_on_tag_id;
    `);
  },
};
