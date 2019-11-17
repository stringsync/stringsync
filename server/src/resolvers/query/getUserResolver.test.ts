import { getUserResolver } from './getUserResolver';
import { GetUserInput } from 'common/types';
import { getTestCtxProvider, getUserFixtures } from '../../testing';

const USER_FIXTURES = getUserFixtures();
const USER1 = USER_FIXTURES.student1;
const USER2 = USER_FIXTURES.student2;

const provideTestCtx = getTestCtxProvider();

it(
  'returns the user from the db that matches the id',
  provideTestCtx({ User: [USER1, USER2] }, async (ctx) => {
    const input: GetUserInput = { id: USER1.id };
    const user = await getUserResolver(undefined, { input }, ctx);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(USER1.id);
  })
);

it(
  'returns null if the user does not exist',
  provideTestCtx({}, async (ctx) => {
    const input: GetUserInput = { id: USER1.id };
    const user = await getUserResolver(undefined, { input }, ctx);

    expect(user).toBeNull();
  })
);
