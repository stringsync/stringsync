import { getTestDbProvider, getUserFixtures } from '../../../testing';
import { getUserByEmailOrUsername } from './getUserByEmailOrUsername';

const STUDENT1 = getUserFixtures().student1;

const provideTestDb = getTestDbProvider();

it(
  'searches users by username',
  provideTestDb({ User: [STUDENT1] }, async (db) => {
    const user = await getUserByEmailOrUsername(db, STUDENT1.username);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'searches users by email',
  provideTestDb({ User: [STUDENT1] }, async (db) => {
    const user = await getUserByEmailOrUsername(db, STUDENT1.email);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'does not return users that do not match',
  provideTestDb({}, async (db) => {
    const user = await getUserByEmailOrUsername(db, STUDENT1.email);
    expect(user).toBeNull();
  })
);
