import { getAuthenticatedRawUser } from './getAuthenticatedRawUser';
import {
  getUserFixtures,
  getUserSessionFixtures,
  getTestDbProvider,
} from '../../../testing';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);
const STUDENT1 = getUserFixtures().student1;
const STUDENT1_SESSION = getUserSessionFixtures().student1Session;

const provideTestDb = getTestDbProvider();

it(
  'returns null when the token is empty',
  provideTestDb({}, async (db) => {
    const token = '';
    const user = await getAuthenticatedRawUser(db, token, NOW);
    expect(user).toBeNull();
  })
);

it(
  'returns null when there is no user session in the db for it',
  provideTestDb({}, async (db) => {
    const user = await getAuthenticatedRawUser(db, TOKEN, NOW);
    expect(user).toBeNull();
  })
);

it(
  'returns null when the db user session is expired',
  provideTestDb(
    {
      User: [STUDENT1],
      UserSession: [{ ...STUDENT1_SESSION, expiresAt: PAST }],
    },
    async (db) => {
      const user = await getAuthenticatedRawUser(db, TOKEN, NOW);

      expect(user).toBeNull();
    }
  )
);

it(
  'returns user when the db user session is active ',
  provideTestDb(
    {
      User: [STUDENT1],
      UserSession: [{ ...STUDENT1_SESSION, expiresAt: FUTURE }],
    },
    async (db) => {
      const user = await getAuthenticatedRawUser(db, TOKEN, NOW);
      expect(user).not.toBeNull();
      expect(user!.id).toBe(STUDENT1.id);
    }
  )
);
