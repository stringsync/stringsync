import { batchGetUsersFromIds } from './batchGetUsersFromIds';
import { useTestGlobalCtx, getFixtures } from '../../testing';
import { User } from 'common/types';

const USER_FIXTURES = getFixtures().User;
const STUDENT1 = USER_FIXTURES.student1;
const STUDENT2 = USER_FIXTURES.student2;
const TEACHER1 = USER_FIXTURES.teacher1;

afterEach(() => {
  jest.clearAllMocks();
});

it(
  'fetches multiple users',
  useTestGlobalCtx(
    {
      fixtures: { User: [STUDENT1, STUDENT2, TEACHER1] },
    },
    async (ctx) => {
      const providedUsers = [STUDENT1, STUDENT2, TEACHER1];
      const providedUserIds = providedUsers.map((user) => user.id);

      const actualUsers = await batchGetUsersFromIds(ctx.db)(providedUserIds);
      const actualUserIds = actualUsers
        .filter((value): value is User => Boolean(value))
        .map((user) => user.id);

      expect(actualUsers.length).toBe(providedUsers.length);
      expect(actualUserIds).toStrictEqual(providedUserIds);
    }
  )
);

it(
  'does not over-fetch users',
  useTestGlobalCtx(
    {
      fixtures: { User: [STUDENT1, STUDENT2, TEACHER1] },
    },
    async (ctx) => {
      const providedUsers = [STUDENT1, TEACHER1];
      const providedUserIds = providedUsers.map((user) => user.id);
      // test correctness of test
      const userCount = await ctx.db.models.User.count();
      expect(providedUsers.length).toBeLessThan(userCount);

      const actualUsers = await batchGetUsersFromIds(ctx.db)(providedUserIds);
      const actualUserIds = actualUsers
        .filter((value): value is User => Boolean(value))
        .map((user) => user.id);

      expect(actualUsers.length).toBe(providedUsers.length);
      expect(actualUserIds).toStrictEqual(providedUserIds);
    }
  )
);

it(
  'fills missing values with null',
  useTestGlobalCtx(
    {
      fixtures: { User: [TEACHER1] },
    },
    async (ctx) => {
      const providedUsers = [STUDENT1, STUDENT2, TEACHER1];
      const missingUsers = [STUDENT1, STUDENT2];
      const providedUserIds = providedUsers.map((user) => user.id);

      const actualUsers = await batchGetUsersFromIds(ctx.db)(providedUserIds);
      const missingErrors = actualUsers.filter(
        (value): value is null => !value
      );

      expect(actualUsers.length).toBe(providedUsers.length);
      expect(missingErrors.length).toBe(missingUsers.length);
    }
  )
);
