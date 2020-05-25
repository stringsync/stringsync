import { resolver } from './confirmEmail';
import { Provider, randStr, createUser } from '../../../../testing';
import { User, NotFoundError, BadRequestError } from '../../../../common';

const USER: User = {
  id: randStr(10),
  confirmedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: `${randStr(10)}@domain.com`,
  role: 'student',
  username: randStr(10),
};

it('sets confirmed at and clears the token', async () => {
  const confirmationToken = randStr(20);
  const reqAt = new Date();

  await Provider.run(
    {
      req: {
        session: { user: { id: USER.id, isLoggedIn: true, role: 'student' } },
      },
      reqAt,
      args: { input: { confirmationToken } },
    },
    async (p) => {
      const { src, args, rctx, info, gctx } = p;

      await createUser(gctx.db, { ...USER, confirmationToken });

      await resolver(src, args, rctx, info);

      const user = await gctx.db.User.findByPk(USER.id);

      expect(user).not.toBeNull();
      expect(user!.confirmationToken).toBeNull();
      expect(user!.confirmedAt?.getTime()).toBe(reqAt.getTime());
    }
  );
});

it('throws an error when the session user is not found', async () => {
  await Provider.run(
    {
      req: {
        session: { user: { id: USER.id, isLoggedIn: true, role: 'student' } },
      },
    },
    async (p) => {
      const { src, args, rctx, info } = p;

      await expect(resolver(src, args, rctx, info)).rejects.toThrowError(
        NotFoundError
      );
    }
  );
});

it('throws an error if the user is already confirmed', async () => {
  await Provider.run(
    {
      req: {
        session: { user: { id: USER.id, isLoggedIn: true, role: 'student' } },
      },
    },
    async (p) => {
      const { src, args, rctx, info, gctx } = p;

      await createUser(gctx.db, { ...USER, confirmedAt: new Date() });

      await expect(resolver(src, args, rctx, info)).rejects.toThrowError(
        BadRequestError
      );
    }
  );
});

it('throws an error if the confirmation token is missing', async () => {
  await Provider.run(
    {
      req: {
        session: { user: { id: USER.id, isLoggedIn: true, role: 'student' } },
      },
      args: { input: { confirmationToken: '' } },
    },
    async (p) => {
      const { src, args, rctx, info, gctx } = p;

      await createUser(gctx.db, { ...USER });

      await expect(resolver(src, args, rctx, info)).rejects.toThrowError(
        BadRequestError
      );
    }
  );
});

it('throws an error if the confirmation token does not match', async () => {
  const confirmationToken = randStr(20);
  const otherConfirmationToken = randStr(20);

  await Provider.run(
    {
      req: {
        session: { user: { id: USER.id, isLoggedIn: true, role: 'student' } },
      },
      args: { input: { otherConfirmationToken } },
    },
    async (p) => {
      const { src, args, rctx, info, gctx } = p;

      await createUser(gctx.db, { ...USER, confirmationToken });

      await expect(resolver(src, args, rctx, info)).rejects.toThrowError(
        BadRequestError
      );
    }
  );
});
