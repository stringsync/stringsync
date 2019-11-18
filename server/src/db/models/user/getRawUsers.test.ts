import { getRawUsers } from './getRawUsers';
import { getFixtures, getTestDbProvider } from '../../../testing';

const USER_FIXTURES = Object.values(getFixtures().User);

const provideTestDb = getTestDbProvider();

it(
  'returns all users',
  provideTestDb({ User: USER_FIXTURES }, async (db) => {
    const rawUsers = await getRawUsers(db);

    expect(rawUsers).toHaveLength(USER_FIXTURES.length);
    const rawUsersIds = rawUsers.map((rawUser) => rawUser.id).sort();
    const expectedUserIds = USER_FIXTURES.map((user) => user.id).sort();
    expect(rawUsersIds).toEqual(expectedUserIds);
  })
);
