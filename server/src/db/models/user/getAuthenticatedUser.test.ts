import { getAuthenticatedUser } from './getAuthenticatedUser';
import { getFixtures, useTestGlobalCtx } from '../../../testing';

const TOKEN = '23dd7932-a42e-42af-95fc-045ef1080bfd';
const NOW = new Date('2019-01-01');
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

const FIXTURES = getFixtures();
const STUDENT1 = FIXTURES.User.student1;
const STUDENT1_SESSION = FIXTURES.UserSession.student1Session;

it(
  'returns null when the token is empty',
  useTestGlobalCtx({}, async (ctx) => {
    const token = '';
    const rawUser = await getAuthenticatedUser(ctx.db, token, NOW);
    expect(rawUser).toBeNull();
  })
);

it(
  'returns null when there is no user session in the db for it',
  useTestGlobalCtx({}, async (ctx) => {
    const rawUser = await getAuthenticatedUser(ctx.db, TOKEN, NOW);
    expect(rawUser).toBeNull();
  })
);

it(
  'returns null when the db user session is expired',
  useTestGlobalCtx(
    {
      fixtures: {
        User: [STUDENT1],
        UserSession: [{ ...STUDENT1_SESSION, expiresAt: PAST }],
      },
    },
    async (ctx) => {
      const rawUser = await getAuthenticatedUser(ctx.db, TOKEN, NOW);

      expect(rawUser).toBeNull();
    }
  )
);

it(
  'returns user when the db user session is active ',
  useTestGlobalCtx(
    {
      fixtures: {
        User: [STUDENT1],
        UserSession: [{ ...STUDENT1_SESSION, expiresAt: FUTURE }],
      },
    },
    async (ctx) => {
      const rawUser = await getAuthenticatedUser(ctx.db, TOKEN, NOW);
      expect(rawUser).not.toBeNull();
      expect(rawUser!.id).toBe(STUDENT1.id);
    }
  )
);
