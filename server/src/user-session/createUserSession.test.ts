import { createUserSession } from './createUserSession';
import { createTestDbProvider, getUserFixtures } from '../testing';
import { getConfig } from '../config';

const USER_FIXTURE = getUserFixtures().student1;

const config = getConfig(process.env);
const provideTestDb = createTestDbProvider(config);

test('sets expiresAt 14 days from issuedAt', async () => {
  await provideTestDb(
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
  );
});

test.each([0, 1, 2, 3])('saves n sessions for a particular user', async (n) => {
  await provideTestDb(
    {
      User: [USER_FIXTURE],
    },
    async (db) => {
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
  );
});
