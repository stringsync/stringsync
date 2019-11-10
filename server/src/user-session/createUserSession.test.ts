import { createUserSession } from './createUserSession';
import { connectToDb } from '../db';
import { Transaction } from 'sequelize';
import { createFixtures, getUserFixtures } from '../db/fixtures';
import { getConfig } from '../config';

const USER_FIXTURE = getUserFixtures().student1;

const config = getConfig(process.env);
const db = connectToDb(config);
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
  createFixtures(db, {
    User: [USER_FIXTURE],
  });

  const issuedAt = new Date('2019-01-01');
  const expected = new Date('2019-01-15').getTime();

  const userSession = await createUserSession(db, USER_FIXTURE.id, issuedAt);

  expect(userSession.expiresAt.getTime()).toBe(expected);
  done();
});

test('saves n sessions for a particular user', async (done) => {
  const n = 2;
  createFixtures(db, {
    User: [USER_FIXTURE],
  });

  const ids = new Array(n);
  for (let i = 0; i < n; i++) {
    const issuedAt = new Date();
    const { id } = await createUserSession(db, USER_FIXTURE.id, issuedAt);
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
