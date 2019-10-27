import { getAuthenticatedUser } from './getAuthenticatedUser';
import { createDb } from '../../db';
import { Transaction } from 'sequelize';
import { User } from '../../db/fixtures';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

const db = createDb();
let transaction: Transaction;

beforeEach(async () => {
  transaction = await db.transaction();
});

afterEach(async () => {
  // await transaction.rollback();
});

test('getAuthenticatedUser with empty token returns null', async (done) => {
  const user = await getAuthenticatedUser(db, {
    token: '',
    requestedAt: NOW,
  });

  expect(user).toBeNull();
  done();
});

test('getAuthenticatedUser with no session in db returns null', async (done) => {
  const user = await getAuthenticatedUser(
    db,
    {
      token: TOKEN,
      requestedAt: NOW,
    },
    transaction
  );

  expect(user).toBeNull();
  done();
});

test('getAuthenticatedUser with expired session in db returns null', async (done) => {
  const student1 = await db.models.User.create(User.student1, { transaction });
  await db.models.UserSession.create(
    {
      userId: student1.id,
      token: TOKEN,
      expiresAt: PAST,
      issuedAt: PAST,
    },
    { transaction }
  );

  const user = await getAuthenticatedUser(
    db,
    {
      token: TOKEN,
      requestedAt: NOW,
    },
    transaction
  );

  expect(user).toBeNull();
  done();
});

test('getAuthenticatedUser with active session in db returns user', async (done) => {
  const student1 = await db.models.User.create(User.student1, { transaction });
  await db.models.UserSession.create(
    {
      userId: student1.id,
      token: TOKEN,
      expiresAt: FUTURE,
      issuedAt: PAST,
    },
    { transaction }
  );
  const user = await getAuthenticatedUser(
    db,
    {
      token: TOKEN,
      requestedAt: NOW,
    },
    transaction
  );
  expect(user).not.toBeNull();
  expect(user!.id).toBe(student1.id);
  done();
});
