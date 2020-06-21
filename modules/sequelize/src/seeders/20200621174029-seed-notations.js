module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('notations', [
      { id: 1, song_name: 'good mourning', artist_name: 'jaredplaysguitar', transcriber_id: 1 },
      { id: 2, song_name: 'panda', artist_name: 'jaredplaysguitar', transcriber_id: 3 },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notations', null, {});
  },
};
