import { getUsersResolver } from './getUsersResolver';
import { getFixtures, getTestCtxProvider } from '../../testing';

const USERS = Object.values(getFixtures().User);

const provideTestCtx = getTestCtxProvider();

it(
  'returns all users',
  provideTestCtx({ User: USERS }, async (ctx) => {
    const users = await getUsersResolver(undefined, {}, ctx);

    expect(users).toHaveLength(USERS.length);
    expect(users.map((user) => user.id).sort()).toEqual(
      USERS.map((user) => user.id).sort()
    );
  })
);
