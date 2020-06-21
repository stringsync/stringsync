const date = new Date('2020-06-21T17:36:41.941Z');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'jaredplaysguitar',
        email: 'jared@gmail.com',
        role: 'admin',
        created_at: date,
        updated_at: date,
        encrypted_password: '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6', // password = 'password'
        avatar_url: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1',
      },
      {
        id: 2,
        username: 'jessicaplayspiano',
        email: 'jessica@hotmail.com',
        role: 'student',
        created_at: date,
        updated_at: date,
        encrypted_password: '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6', // password = 'password'
        avatar_url: 'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab',
      },
      {
        id: 3,
        username: 'jordanplaysflute',
        email: 'jordan@yahoo.com',
        role: 'teacher',
        created_at: date,
        updated_at: date,
        encrypted_password: '$2b$10$SuOsN1G4fCftbp3yejwS.u2EARRSU5cVOCpWOARVuGAbTat5YOhC6', // password = 'password'
        avatar_url: 'https://images.unsplash.com/photo-1552673304-23f6ad21aada',
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
