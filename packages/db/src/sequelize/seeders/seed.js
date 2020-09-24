const { buildUser, buildNotation, buildTag, buildTagging } = require('./util/builder');
const { USER_ROLES } = require('./util/constants');
const { sample, shuffle, randInt } = require('./util/rand');

const times = (num, func) => new Array(num).fill(null).map(func);

module.exports = {
  up: (queryInterface, Sequelize) => {
    // create users
    const users = [
      buildUser({ username: 'student', email: 'student@stringsync.com', role: USER_ROLES.STUDENT }),
      buildUser({ username: 'teacher', email: 'teacher@stringsync.com', role: USER_ROLES.TEACHER }),
      buildUser({ username: 'admin', email: 'admin@stringsync.com', role: USER_ROLES.ADMIN }),
      buildUser({ username: 'jaredplaysguitar', email: 'jared@stringsync.com', role: USER_ROLES.ADMIN }),
      buildUser({ username: 'sebasplaysguitar', email: 'sebas@stringsync.com', role: USER_ROLES.ADMIN }),
      ...times(200, () => buildUser({ role: USER_ROLES.STUDENT })),
      ...times(50, () => buildUser({ role: USER_ROLES.TEACHER })),
    ];

    // create notations
    const teachers = users.filter((user) => user.role === USER_ROLES.TEACHER);
    const admins = users.filter((user) => user.role === USER_ROLES.ADMIN);
    const notations = [
      ...times(200, () => buildNotation({ transcriber_id: sample(teachers).id })),
      ...times(50, () => buildNotation({ transcriber_id: sample(admins).id })),
    ];

    // create tags
    const tags = [
      buildTag({ name: 'acoustic' }),
      buildTag({ name: 'alternative' }),
      buildTag({ name: 'electric' }),
      buildTag({ name: 'jazz' }),
      buildTag({ name: 'neosoul' }),
      buildTag({ name: 'prog' }),
    ];

    // create taggings
    const taggings = notations.flatMap((notation) => {
      const numTaggings = randInt(1, 4);
      const shuffledTags = shuffle(tags.map((tag) => ({ ...tag })));
      const selectedTags = shuffledTags.slice(0, numTaggings);
      return selectedTags.map((tag) => buildTagging({ notation_id: notation.id, tag_id: tag.id }));
    });

    return Promise.resolve()
      .then(() => {
        console.log('creating users');
        return queryInterface.bulkInsert('users', users);
      })
      .then(() => {
        console.log('creating notations');
        return queryInterface.bulkInsert('notations', notations);
      })
      .then(() => {
        console.log('creating tags');
        return queryInterface.bulkInsert('tags', tags);
      })
      .then(() => {
        console.log('creating taggings');
        return queryInterface.bulkInsert('taggings', taggings);
      });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve()
      .then(() => {
        return queryInterface.bulkDelete('users', null, {});
      })
      .then(() => {
        return queryInterface.bulkDelete('notations', null, {});
      })
      .then(() => {
        return queryInterface.bulkDelete('tags', null, {});
      })
      .then(() => {
        return queryInterface.bulkDelete('taggings', null, {});
      });
  },
};
