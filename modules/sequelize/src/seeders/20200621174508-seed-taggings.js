module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('taggings', [
      { id: 1, notation_id: 1, tag_id: 1 },
      { id: 2, notation_id: 1, tag_id: 2 },
      { id: 3, notation_id: 2, tag_id: 2 },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('taggings', null, {});
  },
};
