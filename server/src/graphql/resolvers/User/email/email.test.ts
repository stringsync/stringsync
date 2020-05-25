import { Provider, randStr } from '../../../../testing';
import { resolver, middleware } from './email';
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

describe('resolver', () => {
  it('returns the email address', async () => {
    await Provider.run({ src: USER }, async (p) => {
      const { src, args, rctx, info } = p;

      const value = await resolver(src, args, rctx, info);

      expect(value).toBe(USER.email);
    });
  });
});

describe('middleware', () => {
  it('permits data owners', async () => {
    const mockResolver = jest.fn();
    const newResolver = middleware(mockResolver);

    await Provider.run(
      {
        src: USER,
        req: {
          session: {
            user: { id: USER.id, isLoggedIn: true, role: USER.role },
          },
        },
      },
      async (p) => {
        const { src, args, rctx, info } = p;

        await newResolver(src, args, rctx, info);

        expect(mockResolver).toHaveBeenCalled();
      }
    );
  });

  it('permits admins', async () => {
    const mockResolver = jest.fn();
    const newResolver = middleware(mockResolver);

    await Provider.run(
      {
        src: USER,
        req: {
          session: {
            user: { id: randStr(10), isLoggedIn: true, role: 'admin' },
          },
        },
      },
      async (p) => {
        const { src, args, rctx, info } = p;

        await newResolver(src, args, rctx, info);

        expect(mockResolver).toHaveBeenCalled();
      }
    );
  });

  it('forbids non data owners that are not admins', async () => {
    const mockResolver = jest.fn();
    const newResolver = middleware(mockResolver);

    await Provider.run(
      {
        src: USER,
        req: {
          session: {
            user: { id: randStr(10), isLoggedIn: true, role: 'teacher' },
          },
        },
      },
      async (p) => {
        const { src, args, rctx, info } = p;

        await expect(newResolver(src, args, rctx, info)).rejects.toThrow();

        expect(mockResolver).not.toHaveBeenCalled();
      }
    );
  });
});
