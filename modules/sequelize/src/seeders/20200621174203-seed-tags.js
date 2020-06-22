module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tags', [
      { id: '7DRExScr', name: 'acoustic' },
      { id: '8Xh5Obof', name: 'alternative' },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tags', null, {});
  },
};
