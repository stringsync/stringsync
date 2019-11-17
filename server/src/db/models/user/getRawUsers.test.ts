import { getRawUsers } from './getRawUsers';
import { getUserFixtures, getTestDbProvider } from '../../../testing';

const USERS = Object.values(getUserFixtures());

const provideTestDb = getTestDbProvider();

it(
  'returns all users',
  provideTestDb({ User: USERS }, async (db) => {
    const rawUsers = await getRawUsers(db);

    expect(rawUsers).toHaveLength(USERS.length);
    expect(rawUsers.map((rawUser) => rawUser.id).sort()).toEqual(
      USERS.map((user) => user.id).sort()
    );
  })
);
