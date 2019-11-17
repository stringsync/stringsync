import { getUsers } from './getUsers';
import { getTestRequestContextProvider } from '../../testing';
import { getUserFixtures } from '../../testing';

const USERS = Object.values(getUserFixtures());

const provideTestCtx = getTestRequestContextProvider();

it(
  'returns all users',
  provideTestCtx({ User: USERS }, async (ctx) => {
    const users = await getUsers(undefined, {}, ctx);

    expect(users).toHaveLength(USERS.length);
  })
);
