import { withAuthRequirement } from './withAuthRequirement';
import { SessionUser } from '../../util/session';
import { Provider } from '../../testing';
import { AuthRequirements } from '../../common';

const ANONYMOUS: SessionUser = {
  id: '',
  isLoggedIn: false,
  role: 'student',
};
const STUDENT: SessionUser = {
  id: 'id',
  isLoggedIn: true,
  role: 'student',
};
const TEACHER: SessionUser = {
  id: 'id',
  isLoggedIn: true,
  role: 'teacher',
};
const ADMIN: SessionUser = {
  id: 'id',
  isLoggedIn: true,
  role: 'admin',
};

describe('with AuthRequirements.NONE', () => {
  it.each([ANONYMOUS, STUDENT, TEACHER, ADMIN])(
    'permits all user roles',
    async (user) => {
      const resolver = jest.fn();
      const req = { session: { user } };

      await Provider.run({ req }, async (p) => {
        const { src, args, rctx, info } = p;
        const middleware = withAuthRequirement(AuthRequirements.NONE);
        const newResolver = middleware(resolver);

        await newResolver(src, args, rctx, info);

        expect(resolver).toHaveBeenCalled();
      });
    }
  );
});

describe('with AuthRequirements.LOGGED_IN', () => {
  it.each([STUDENT, TEACHER, ADMIN])('permits any user role', async (user) => {
    const resolver = jest.fn();
    const req = { session: { user } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(AuthRequirements.LOGGED_IN);
      const newResolver = middleware(resolver);

      await newResolver(src, args, rctx, info);

      expect(resolver).toHaveBeenCalled();
    });
  });

  it('forbids anonymous users', async () => {
    const resolver = jest.fn();
    const req = { session: { user: ANONYMOUS } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(AuthRequirements.LOGGED_IN);
      const newResolver = middleware(resolver);

      await expect(newResolver(src, args, rctx, info)).rejects.toThrow();
      expect(resolver).not.toHaveBeenCalled();
    });
  });
});

describe('with AuthRequirements.LOGGED_OUT', () => {
  it('permits anonymous users', async () => {
    const resolver = jest.fn();
    const req = { session: { user: ANONYMOUS } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(AuthRequirements.LOGGED_OUT);
      const newResolver = middleware(resolver);

      await newResolver(src, args, rctx, info);

      expect(resolver).toHaveBeenCalled();
    });
  });

  it.each([STUDENT, TEACHER, ADMIN])(
    'forbids logged in users',
    async (user) => {
      const resolver = jest.fn();
      const req = { session: { user } };

      await Provider.run({ req }, async (p) => {
        const { src, args, rctx, info } = p;
        const middleware = withAuthRequirement(AuthRequirements.LOGGED_OUT);
        const newResolver = middleware(resolver);

        await expect(newResolver(src, args, rctx, info)).rejects.toThrow();
        expect(resolver).not.toHaveBeenCalled();
      });
    }
  );
});

describe('with AuthRequirements LOGGED_IN_AS_STUDENT', () => {
  it.each([STUDENT, TEACHER, ADMIN])(
    'permits any logged in user',
    async (user) => {
      const resolver = jest.fn();
      const req = { session: { user } };

      await Provider.run({ req }, async (p) => {
        const { src, args, rctx, info } = p;
        const middleware = withAuthRequirement(
          AuthRequirements.LOGGED_IN_AS_STUDENT
        );
        const newResolver = middleware(resolver);

        await newResolver(src, args, rctx, info);

        expect(resolver).toHaveBeenCalled();
      });
    }
  );

  it('forbids anonymous users', async () => {
    const resolver = jest.fn();
    const req = { session: { user: ANONYMOUS } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(
        AuthRequirements.LOGGED_IN_AS_STUDENT
      );
      const newResolver = middleware(resolver);

      await expect(newResolver(src, args, rctx, info)).rejects.toThrow();
      expect(resolver).not.toHaveBeenCalled();
    });
  });
});

describe('with AuthRequirements LOGGED_IN_AS_TEACHER', () => {
  it.each([TEACHER, ADMIN])('permits >= teacher roles', async (user) => {
    const resolver = jest.fn();
    const req = { session: { user } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(
        AuthRequirements.LOGGED_IN_AS_TEACHER
      );
      const newResolver = middleware(resolver);

      await newResolver(src, args, rctx, info);

      expect(resolver).toHaveBeenCalled();
    });
  });

  it.each([ANONYMOUS, STUDENT])('forbids < teacher roles', async (user) => {
    const resolver = jest.fn();
    const req = { session: { user } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(
        AuthRequirements.LOGGED_IN_AS_TEACHER
      );
      const newResolver = middleware(resolver);

      await expect(newResolver(src, args, rctx, info)).rejects.toThrow();
      expect(resolver).not.toHaveBeenCalled();
    });
  });
});

describe('with AuthRequirements LOGGED_IN_AS_ADMIN', () => {
  it('permits admin roles', async () => {
    const resolver = jest.fn();
    const req = { session: { user: ADMIN } };

    await Provider.run({ req }, async (p) => {
      const { src, args, rctx, info } = p;
      const middleware = withAuthRequirement(
        AuthRequirements.LOGGED_IN_AS_ADMIN
      );
      const newResolver = middleware(resolver);

      await newResolver(src, args, rctx, info);

      expect(resolver).toHaveBeenCalled();
    });
  });

  it.each([ANONYMOUS, STUDENT, TEACHER])(
    'forbids < admin roles',
    async (user) => {
      const resolver = jest.fn();
      const req = { session: { user } };

      await Provider.run({ req }, async (p) => {
        const { src, args, rctx, info } = p;
        const middleware = withAuthRequirement(
          AuthRequirements.LOGGED_IN_AS_ADMIN
        );
        const newResolver = middleware(resolver);

        await expect(newResolver(src, args, rctx, info)).rejects.toThrow();
        expect(resolver).not.toHaveBeenCalled();
      });
    }
  );
});
