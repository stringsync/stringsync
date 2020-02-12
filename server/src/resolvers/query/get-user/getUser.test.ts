import { getUser } from './getUser';
import { GetUserInput } from 'common/types';
import { useTestReqCtx, getFixtures } from '../../../testing';

const USER_FIXTURES = getFixtures().User;
const USER1 = USER_FIXTURES.student1;
const USER2 = USER_FIXTURES.student2;

it(
  'returns the user from the db that matches the id',
  useTestReqCtx({ fixtures: { User: [USER1, USER2] } }, async (ctx) => {
    const input: GetUserInput = { id: USER1.id };
    const user = await getUser(undefined, { input }, ctx);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(USER1.id);
  })
);

it(
  'returns null if the user does not exist',
  useTestReqCtx({}, async (ctx) => {
    const input: GetUserInput = { id: USER1.id };
    const user = await getUser(undefined, { input }, ctx);

    expect(user).toBeNull();
  })
);
