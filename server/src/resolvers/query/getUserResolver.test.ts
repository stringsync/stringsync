import { getUserResolver } from './getUserResolver';
import { GetUserInput } from 'common/types';
import { useTestCtx, getFixtures } from '../../testing';

const USER_FIXTURES = getFixtures().User;
const USER1 = USER_FIXTURES.student1;
const USER2 = USER_FIXTURES.student2;

it(
  'returns the user from the db that matches the id',
  useTestCtx({ User: [USER1, USER2] }, {}, async (ctx) => {
    const input: GetUserInput = { id: USER1.id };
    const user = await getUserResolver(undefined, { input }, ctx);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(USER1.id);
  })
);

it(
  'returns null if the user does not exist',
  useTestCtx({}, {}, async (ctx) => {
    const input: GetUserInput = { id: USER1.id };
    const user = await getUserResolver(undefined, { input }, ctx);

    expect(user).toBeNull();
  })
);
