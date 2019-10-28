import { createUserSession } from './createUserSession';
import { createDb } from '../../db';
import { Transaction } from 'sequelize';
import { createFixtures, UserFixtures } from '../../db/fixtures';

const USER_FIXTURE = { ...UserFixtures.student1 };

const db = createDb();
let transaction: Transaction;

beforeEach(async (done) => {
  transaction = await db.transaction({ logging: false });
  done();
});

afterEach(async (done) => {
  await transaction.rollback();
  done();
});

test('sets expiresAt 14 days from issuedAt', async (done) => {
  createFixtures(db, transaction, {
    User: [USER_FIXTURE],
  });

  const issuedAt = new Date('2019-01-01');
  const expected = new Date('2019-01-15').getTime();

  const userSession = await createUserSession(
    db,
    { userId: USER_FIXTURE.id, issuedAt },
    transaction
  );

  expect(userSession.expiresAt.getTime()).toBe(expected);
  done();
});

// TODO: fix this test
// test('saves a user session to the db', async (done) => {
//   createFixtures(db, transaction, {
//     User: [USER_FIXTURE],
//   });

//   const issuedAt = new Date();

//   const { id } = await createUserSession(db, {
//     userId: USER_FIXTURE.id,
//     issuedAt,
//   });

//   const userSession = await db.models.UserSession.findByPk(id);
//   expect(userSession).not.toBeNull();
//   done();
// });
