import { getRawUsers } from './getRawUsers';
import { getFixtures, useTestDb } from '../../../testing';

const USER_FIXTURES = Object.values(getFixtures().User);

it(
  'returns all users',
  useTestDb({ User: USER_FIXTURES }, async (db) => {
    const rawUsers = await getRawUsers(db);

    expect(rawUsers).toHaveLength(USER_FIXTURES.length);
    const rawUsersIds = rawUsers.map((rawUser) => rawUser.id).sort();
    const expectedUserIds = USER_FIXTURES.map((user) => user.id).sort();
    expect(rawUsersIds).toEqual(expectedUserIds);
  })
);
