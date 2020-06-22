module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('notations', [
      { id: '81gd7K6a', song_name: 'good mourning', artist_name: 'jaredplaysguitar', transcriber_id: 'n75JsGCe' },
      { id: 'lym3HVNR', song_name: 'panda', artist_name: 'jaredplaysguitar', transcriber_id: 'kQwv7OL9' },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notations', null, {});
  },
};
