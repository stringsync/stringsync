import { getAuthenticatedUser } from './getAuthenticatedUser';
import { createDb } from '../../db';
import { Transaction } from 'sequelize';
import {
  createFixtures,
  UserFixtures,
  UserSessionFixtures,
} from '../../db/fixtures';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

const USER_FIXTURE = { ...UserFixtures.student1 };
const USER_SESSION_FIXTURE = { ...UserSessionFixtures.student1Session };

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

test('getAuthenticatedUser with empty token returns null', async (done) => {
  const user = await getAuthenticatedUser(db, transaction, {
    token: '',
    requestedAt: NOW,
  });

  expect(user).toBeNull();
  done();
});

test('getAuthenticatedUser with no session in db returns null', async (done) => {
  const user = await getAuthenticatedUser(db, transaction, {
    token: TOKEN,
    requestedAt: NOW,
  });

  expect(user).toBeNull();
  done();
});

test('getAuthenticatedUser with expired session in db returns null', async (done) => {
  await createFixtures(db, transaction, {
    User: [USER_FIXTURE],
    UserSession: [{ ...USER_SESSION_FIXTURE, expiresAt: PAST }],
  });

  const user = await getAuthenticatedUser(db, transaction, {
    token: TOKEN,
    requestedAt: NOW,
  });

  expect(user).toBeNull();
  done();
});

test('getAuthenticatedUser with active session in db returns user', async (done) => {
  await createFixtures(db, transaction, {
    User: [USER_FIXTURE],
    UserSession: [{ ...USER_SESSION_FIXTURE, expiresAt: FUTURE }],
  });

  const user = await getAuthenticatedUser(db, transaction, {
    token: TOKEN,
    requestedAt: NOW,
  });
  expect(user).not.toBeNull();
  expect(user!.id).toBe(USER_FIXTURE.id);
  done();
});
