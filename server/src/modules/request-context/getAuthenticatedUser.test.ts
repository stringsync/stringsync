import { getAuthenticatedUser } from './getAuthenticatedUser';
import { connectToDb } from '../../db';
import { Transaction } from 'sequelize';
import {
  createFixtures,
  getUserFixtures,
  getUserSessionFixtures,
} from '../../db/fixtures';
import { getConfig } from '../config';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

const USER_FIXTURE = getUserFixtures().student1;
const USER_SESSION_FIXTURE = getUserSessionFixtures().student1Session;

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

test('returns null when the token is empty', async (done) => {
  const user = await getAuthenticatedUser(db, transaction, {
    token: '',
    requestedAt: NOW,
  });

  expect(user).toBeNull();
  done();
});

test('returns null when there is no user session in the db for it', async (done) => {
  const user = await getAuthenticatedUser(db, transaction, {
    token: TOKEN,
    requestedAt: NOW,
  });

  expect(user).toBeNull();
  done();
});

test('returns null when the db user session is expired', async (done) => {
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

test('returns user when the db user session is active ', async (done) => {
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
