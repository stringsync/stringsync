import { isDataOwner } from './isDataOwner';
import { Provider, randStr } from '../../../../testing';
import { User } from '../../../../common';

const USER: User = {
  id: randStr(10),
  confirmedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: randStr(10),
  role: 'student',
  username: randStr(10),
};

it('returns true when the logged in user is the queried user', async () => {
  await Provider.run(
    {
      src: USER,
      req: {
        session: {
          user: {
            id: USER.id,
            isLoggedIn: true,
            role: USER.role,
          },
        },
      },
    },
    async (p) => {
      const { src, args, rctx, info } = p;

      const value = await isDataOwner(src, args, rctx, info);

      expect(value).toBe(true);
    }
  );
});

it('returns false when the logged in user is not the queried user', async () => {
  await Provider.run(
    {
      src: USER,
      req: {
        session: {
          user: {
            id: 'randomuserid',
            isLoggedIn: true,
            role: 'admin',
          },
        },
      },
    },
    async (p) => {
      const { src, args, rctx, info } = p;

      const value = await isDataOwner(src, args, rctx, info);

      expect(value).toBe(false);
    }
  );
});
