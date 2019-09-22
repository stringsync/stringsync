'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const now = new Date();

    return queryInterface.bulkInsert('users', [
      {
        username: 'foo',
        email: 'foo@foo.com',
        created_at: now,
        updated_at: now,
      },
      {
        username: 'bar',
        email: 'bar@bar.com',
        created_at: now,
        updated_at: now,
      },
      {
        username: 'baz',
        email: 'baz@baz.com',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
