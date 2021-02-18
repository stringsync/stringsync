module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE tags (
          id TEXT PRIMARY KEY,
          name TEXT UNIQUE NOT NULL
      );

      CREATE TRIGGER trigger_generate_tag_id BEFORE INSERT ON tags FOR EACH ROW EXECUTE PROCEDURE unique_short_id();
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE tags;

      DROP TRIGGER trigger_generate_tag_id ON tags;
    `);
  },
};
