module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL
      );
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TABLE tags;
    `);
  },
};
