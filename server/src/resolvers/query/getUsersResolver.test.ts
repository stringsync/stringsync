import { getUsersResolver } from './getUsersResolver';
import { getUserFixtures, getTestCtxProvider } from '../../testing';

const USER_FIXTURES = getUserFixtures();
const USER1 = USER_FIXTURES.student1;
const USER2 = USER_FIXTURES.student2;
const USER3 = USER_FIXTURES.teacher1;
const USERS = [USER1, USER2, USER3];

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
