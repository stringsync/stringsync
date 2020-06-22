module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('taggings', [
      { id: 'T48u67zw', notation_id: '81gd7K6a', tag_id: '7DRExScr' },
      { id: 'JoNqVYqK', notation_id: 'lym3HVNR', tag_id: '8Xh5Obof' },
      { id: 'S1R5pidB', notation_id: 'lym3HVNR', tag_id: '7DRExScr' },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('taggings', null, {});
  },
};
