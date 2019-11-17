import { getUsers } from './getUsers';
import { getUserFixtures, getTestDbProvider } from '../../../testing';

const USERS = Object.values(getUserFixtures());

const provideTestDb = getTestDbProvider();

it(
  'returns all users',
  provideTestDb({ User: USERS }, async (db) => {
    const users = await getUsers(db);

    expect(users).toHaveLength(USERS.length);
    expect(users.map((user) => user.id)).toContainEqual(USERS.map((id) => id));
  })
);
