module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      CREATE TYPE roles AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
    `);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`
      DROP TYPE roles;
    `);
  },
};
