import { getRawUser } from './getRawUser';
import { getTestDbProvider, getUserFixtures } from '../../../testing';

const provideTestDb = getTestDbProvider();

const USER_FIXTURES = getUserFixtures();
const USER1 = USER_FIXTURES.student1;
const USER2 = USER_FIXTURES.student2;

it(
  'finds a user matching the id',
  provideTestDb({ User: [USER1, USER2] }, async (db) => {
    const rawUser = await getRawUser(db, USER1.id);

    expect(rawUser).not.toBeNull();
    expect(rawUser!.id).toBe(USER1.id);
  })
);

it(
  'returns null when the user is not in db',
  provideTestDb({}, async (db) => {
    const rawUser = await getRawUser(db, USER1.id);

    expect(rawUser).toBeNull();
  })
);
