'use strict';

const bcrypt = require('bcrypt');

const NOW = new Date('2019-09-22T14:45:43.045Z');
const HASH_ROUNDS = 10;
const PASSWORD = 'password';

const encrypt = async (password) => await bcrypt.hash(password, HASH_ROUNDS);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const encryptedPassword = await encrypt(PASSWORD);
    return queryInterface.bulkInsert('users', [
      {
        username: 'jaredplaysguitar',
        email: 'jared@gmail.com',
        created_at: NOW,
        updated_at: NOW,
        encrypted_password: encryptedPassword,
      },
      {
        username: 'jessicaplayspiano',
        email: 'jessica@hotmail.com',
        created_at: NOW,
        updated_at: NOW,
        encrypted_password: encryptedPassword,
      },
      {
        username: 'jordanplaysflute',
        email: 'jordan@yahoo.com',
        created_at: NOW,
        updated_at: NOW,
        encrypted_password: encryptedPassword,
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
