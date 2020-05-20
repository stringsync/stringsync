import { getUsers } from './getUsers';
import { getFixtures, useTestReqCtx } from '../../../testing';

const USERS = Object.values(getFixtures().User);

it(
  'returns all users',
  useTestReqCtx({ fixtures: { User: USERS } }, async (ctx) => {
    const users = await getUsers(undefined, {}, ctx);

    expect(users).toHaveLength(USERS.length);
    expect(users.map((user) => user.id).sort()).toEqual(
      USERS.map((user) => user.id).sort()
    );
  })
);
