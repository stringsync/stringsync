import { createRawUserSession } from './createRawUserSession';
import { getTestDbProvider, getUserFixtures } from '../../../testing';

const STUDENT1 = getUserFixtures().student1;

const provideTestDb = getTestDbProvider();

it(
  'sets expiresAt 14 days from issuedAt',
  provideTestDb(
    {
      User: [STUDENT1],
    },
    async (db) => {
      const issuedAt = new Date('2019-01-01');
      const expiresAt = new Date('2019-01-15');

      const userSession = await createRawUserSession(db, STUDENT1.id, issuedAt);

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
        const { id } = await createRawUserSession(db, STUDENT1.id, issuedAt);
        ids[i] = id;
      }
      const count = await db.models.UserSession.count();
      expect(count).toBe(n);

      const userSessions = await db.models.UserSession.findAll({
        where: { id: ids },
      });
      expect(userSessions).toHaveLength(n);
    }
  )
);
