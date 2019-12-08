import { getAuthenticatedUser } from './getAuthenticatedUser';
import { getFixtures, useTestDb } from '../../../testing';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

const FIXTURES = getFixtures();
const STUDENT1 = FIXTURES.User.student1;
const STUDENT1_SESSION = FIXTURES.UserSession.student1Session;

it(
  'returns null when the token is empty',
  useTestDb({}, async (db) => {
    const token = '';
    const rawUser = await getAuthenticatedUser(db, token, NOW);
    expect(rawUser).toBeNull();
  })
);

it(
  'returns null when there is no user session in the db for it',
  useTestDb({}, async (db) => {
    const rawUser = await getAuthenticatedUser(db, TOKEN, NOW);
    expect(rawUser).toBeNull();
  })
);

it(
  'returns null when the db user session is expired',
  useTestDb(
    {
      User: [STUDENT1],
      UserSession: [{ ...STUDENT1_SESSION, expiresAt: PAST }],
    },
    async (db) => {
      const rawUser = await getAuthenticatedUser(db, TOKEN, NOW);

      expect(rawUser).toBeNull();
    }
  )
);

it(
  'returns user when the db user session is active ',
  useTestDb(
    {
      User: [STUDENT1],
      UserSession: [{ ...STUDENT1_SESSION, expiresAt: FUTURE }],
    },
    async (db) => {
      const rawUser = await getAuthenticatedUser(db, TOKEN, NOW);
      expect(rawUser).not.toBeNull();
      expect(rawUser!.id).toBe(STUDENT1.id);
    }
  )
);
