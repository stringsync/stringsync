import { resolver } from './whoami';
import { Provider, randStr, createUser } from '../../../../testing';
import { UserRoles } from '../../../../common';
import { toUser } from '../../../../data/db';

it('returns null when not logged in', async () => {
  const id = randStr(10);

  Provider.run(
    { req: { session: { user: { id, isLoggedIn: true, role: 'student' } } } },
    async (p) => {
      const { src, args, rctx, info } = p;

      const value = await resolver(src, args, rctx, info);

      expect(value).toBeNull();
    }
  );
});

it('returns the logged in user', async () => {
  const id = randStr(10);
  const role: UserRoles = 'student';

  await Provider.run(
    { req: { session: { user: { id, isLoggedIn: true, role } } } },
    async (p) => {
      const { src, args, rctx, info, gctx } = p;

      const user = await createUser(gctx.db, { id, role });
      const expectedUser = toUser(user);
      const actualUser = await resolver(src, args, rctx, info);

      expect(actualUser).toStrictEqual(expectedUser);
    }
  );
});
