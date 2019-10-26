import { Db } from '../../db/types';
import { createDb } from '../../db/createDb';
import { Sequelize } from 'sequelize';

const foo = async (db: Db) => {
  await db.transaction(async (transaction) => {
    await db.models.User.create(
      {
        username: 'foobar',
        email: 'foobar@gmail.com',
        encryptedPassword: 'asdfasfasd',
      },
      { transaction }
    );
    await db.models.User.findOne({
      where: { username: 'foobar' },
      transaction,
    });
  });
};

const db: Db = createDb(
  new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '', 10),
  })
);

afterEach(async (done) => {
  for (const [_, Model] of Object.entries(db.models)) {
    await Model.truncate({ cascade: true, restartIdentity: true });
  }
  done();
});

test('db tests are cool', async (done) => {
  await foo(db);
  done();
});

test('db tests are REALLY cool', async (done) => {
  await foo(db);
  done();
});
