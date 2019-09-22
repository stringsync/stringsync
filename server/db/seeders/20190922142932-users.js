'use strict';

const NOW = new Date('2019-09-22T14:45:43.045Z');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        username: 'foo',
        email: 'foo@foo.com',
        created_at: NOW,
        updated_at: NOW,
      },
      {
        username: 'bar',
        email: 'bar@bar.com',
        created_at: NOW,
        updated_at: NOW,
      },
      {
        username: 'baz',
        email: 'baz@baz.com',
        created_at: NOW,
        updated_at: NOW,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
