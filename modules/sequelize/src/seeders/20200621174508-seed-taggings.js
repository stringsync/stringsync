module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('taggings', [
      { id: 'T48u67zw', notation_id: 'IxYot3C0', tag_id: '7DRExScr' },
      { id: 'JoNqVYqK', notation_id: 'aPj4rcKB', tag_id: '8Xh5Obof' },
      { id: 'S1R5pidB', notation_id: 'aPj4rcKB', tag_id: '7DRExScr' },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('taggings', null, {});
  },
};
