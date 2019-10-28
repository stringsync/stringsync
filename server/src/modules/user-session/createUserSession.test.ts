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

  const userSession = await createUserSession(db, transaction, {
    userId: USER_FIXTURE.id,
    issuedAt,
  });

  expect(userSession.expiresAt.getTime()).toBe(expected);
  done();
});

test('saves a user session to the db', async (done) => {
  createFixtures(db, transaction, {
    User: [USER_FIXTURE],
  });

  const { id } = await createUserSession(db, transaction, {
    userId: USER_FIXTURE.id,
    issuedAt: new Date(),
  });
  const count = await db.models.UserSession.count({ transaction });
  const userSession = await db.models.UserSession.findByPk(id, { transaction });

  expect(count).toBe(1);
  expect(userSession).not.toBeNull();
  done();
});

test('saves n sessions for a particular user', async (done) => {
  const n = 2;
  createFixtures(db, transaction, {
    User: [USER_FIXTURE],
  });

  const ids = new Array(n);
  for (let i = 0; i < n; i++) {
    const { id } = await createUserSession(db, transaction, {
      userId: USER_FIXTURE.id,
      issuedAt: new Date(),
    });
    ids[i] = id;
  }
  const count = await db.models.UserSession.count({ transaction });
  const userSessions = await db.models.UserSession.findAll({
    where: { id: ids },
    transaction,
  });

  expect(count).toBe(n);
  expect(userSessions.length).toBe(n);
  done();
});
