module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('tags', [
      { id: '7DRExScr', name: 'acoustic' },
      { id: '8Xh5Obof', name: 'alternative' },
      { id: '73RExScr', name: 'electric' },
      { id: '8Xh4Obof', name: 'jazz' },
      { id: '7DRxxScr', name: 'neosoul' },
      { id: 'qXh5Obof', name: 'prog' },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('tags', null, {});
  },
};
