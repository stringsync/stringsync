import { getAuthenticatedUser } from './getAuthenticatedUser';
import { getUserFixtures, getUserSessionFixtures } from '../testing';
import { getConfig } from '../config';
import { createTestDbProvider } from '../testing';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

const USER_FIXTURE = getUserFixtures().student1;
const USER_SESSION_FIXTURE = getUserSessionFixtures().student1Session;

const config = getConfig(process.env);
const provideTestDb = createTestDbProvider(config);

test('returns null when the token is empty', async () => {
  await provideTestDb({}, async (db) => {
    const token = '';
    const user = await getAuthenticatedUser(db, token, NOW);
    expect(user).toBeNull();
  });
});

test('returns null when there is no user session in the db for it', async () => {
  await provideTestDb({}, async (db) => {
    const user = await getAuthenticatedUser(db, TOKEN, NOW);
    expect(user).toBeNull();
  });
});

test('returns null when the db user session is expired', async () => {
  await provideTestDb(
    {
      User: [USER_FIXTURE],
      UserSession: [{ ...USER_SESSION_FIXTURE, expiresAt: PAST }],
    },
    async (db) => {
      const user = await getAuthenticatedUser(db, TOKEN, NOW);

      expect(user).toBeNull();
    }
  );
});

test('returns user when the db user session is active ', async () => {
  await provideTestDb(
    {
      User: [USER_FIXTURE],
      UserSession: [{ ...USER_SESSION_FIXTURE, expiresAt: FUTURE }],
    },
    async (db) => {
      const user = await getAuthenticatedUser(db, TOKEN, NOW);
      expect(user).not.toBeNull();
      expect(user!.id).toBe(USER_FIXTURE.id);
    }
  );
});
