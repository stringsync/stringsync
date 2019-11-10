import { createUserSession } from './createUserSession';
import { getTestDbProvider, getUserFixtures } from '../../../testing';
import { getConfig } from '../../../config';

const STUDENT1 = getUserFixtures().student1;

const config = getConfig(process.env);
const provideTestDb = getTestDbProvider(config);

it(
  'sets expiresAt 14 days from issuedAt',
  provideTestDb(
    {
      User: [STUDENT1],
    },
    async (db) => {
      const issuedAt = new Date('2019-01-01');
      const expiresAt = new Date('2019-01-15');

      const userSession = await createUserSession(db, STUDENT1.id, issuedAt);

      expect(userSession.issuedAt).toEqual(issuedAt);
      expect(userSession.expiresAt).toEqual(expiresAt);
      expect(userSession.userId).toBe(STUDENT1.id);
    }
  )
);

it.each([0, 1, 2, 3])(
  'saves n sessions for a particular user',
  provideTestDb(
    {
      User: [STUDENT1],
    },
    async (db, n) => {
      const ids = new Array(n);
      for (let i = 0; i < n; i++) {
        const issuedAt = new Date();
        const { id } = await createUserSession(db, STUDENT1.id, issuedAt);
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
