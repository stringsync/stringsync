import { getRawUser } from './getRawUser';
import { useTestDb, getFixtures } from '../../../testing';

const USER_FIXTURES = getFixtures().User;
const USER1 = USER_FIXTURES.student1;
const USER2 = USER_FIXTURES.student2;

it(
  'finds a user matching the id',
  useTestDb({ User: [USER1, USER2] }, async (db) => {
    const rawUser = await getRawUser(db, USER1.id);

    expect(rawUser).not.toBeNull();
    expect(rawUser!.id).toBe(USER1.id);
  })
);

it(
  'returns null when the user is not in db',
  useTestDb({}, async (db) => {
    const rawUser = await getRawUser(db, USER1.id);

    expect(rawUser).toBeNull();
  })
);
