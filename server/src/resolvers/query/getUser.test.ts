import { getUser } from './getUser';
import { getTestCtxProvider } from '../../testing';
import { GetUserInput } from 'common/types';
import { getUserFixtures } from '../../testing';

const USER_FIXTURES = getUserFixtures();
const STUDENT1 = USER_FIXTURES.student1;

const provideTestCtx = getTestCtxProvider();

it(
  'returns a user matching the id',
  provideTestCtx({ User: [STUDENT1] }, async (ctx) => {
    const input: GetUserInput = { id: STUDENT1.id };
    const user = await getUser(undefined, { input }, ctx);

    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'returns null for missing users',
  provideTestCtx({}, async (ctx) => {
    const input: GetUserInput = { id: STUDENT1.id };
    const user = await getUser(undefined, { input }, ctx);

    expect(user).toBeNull();
  })
);
