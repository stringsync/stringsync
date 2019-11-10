import { createUserSession } from './createUserSession';
import { createTestDbProvider, getUserFixtures } from '../../../testing';
import { getConfig } from '../../../config';

const USER_FIXTURE = getUserFixtures().student1;

const config = getConfig(process.env);
const provideTestDb = createTestDbProvider(config);

it(
  'sets expiresAt 14 days from issuedAt',
  provideTestDb(
    {
      User: [USER_FIXTURE],
    },
    async (db) => {
      const issuedAt = new Date('2019-01-01');
      const expected = new Date('2019-01-15').getTime();

      const userSession = await createUserSession(
        db,
        USER_FIXTURE.id,
        issuedAt
      );

      expect(userSession.expiresAt.getTime()).toBe(expected);
    }
  )
);

it.each([0, 1, 2, 3])(
  'saves n sessions for a particular user',
  provideTestDb(
    {
      User: [USER_FIXTURE],
    },
    async (db, n: number) => {
      const ids = new Array(n);
      for (let i = 0; i < n; i++) {
        const issuedAt = new Date();
        const { id } = await createUserSession(db, USER_FIXTURE.id, issuedAt);
        ids[i] = id;
      }
      const count = await db.models.UserSession.count();
      const userSessions = await db.models.UserSession.findAll({
        where: { id: ids },
      });

      expect(count).toBe(n);
      expect(userSessions.length).toBe(n);
    }
  )
);
