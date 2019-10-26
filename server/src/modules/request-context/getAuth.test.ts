import { createDb, Db, createDbConnection, truncateAll } from '../../db';
import { getConfig } from '../config';

const config = getConfig(process.env);
const connection = createDbConnection(config);
const db = createDb(connection);

afterEach(async (done) => {
  await truncateAll(db);
  done();
});

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

test('db tests are cool', async (done) => {
  await foo(db);
  done();
});
