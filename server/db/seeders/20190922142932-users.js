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
        email: 'jared@gmail.com',
        username: 'jaredplaysguitar',
        created_at: NOW,
        updated_at: NOW,
        encrypted_password: encryptedPassword,
        avatar_url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
      },
      {
        username: 'jessicaplayspiano',
        email: 'jessica@hotmail.com',
        created_at: NOW,
        updated_at: NOW,
        encrypted_password: encryptedPassword,
        avatar_url:
          'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab',
      },
      {
        username: 'jordanplaysflute',
        email: 'jordan@yahoo.com',
        created_at: NOW,
        updated_at: NOW,
        encrypted_password: encryptedPassword,
        avatar_url: 'https://images.unsplash.com/photo-1552673304-23f6ad21aada',
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
