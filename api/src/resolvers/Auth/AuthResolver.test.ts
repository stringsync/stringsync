import { User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { SessionUser } from '../../server';
import { AuthService } from '../../services';
import { EntityFactory, gql, LoginInput, Mutation, Query, resolve } from '../../testing';
import { randStr } from '../../util';
import { generateSchema } from '../generateSchema';

describe('AuthResolver', () => {
  const schema = generateSchema();
  let entityFactory: EntityFactory;

  beforeEach(() => {
    entityFactory = container.get<EntityFactory>(TYPES.EntityFactory);
  });

  describe('whoami', () => {
    const whoami = async (sessionUser?: SessionUser) => {
      return resolve<Query, 'whoami'>(
        gql`
          query {
            whoami {
              id
            }
          }
        `,
        {},
        { sessionUser }
      );
    };

    it('returns null when logged out', async () => {
      const { res } = await whoami();

      expect(res.data.whoami).toBeNull();
    });

    it('returns the session user', async () => {
      const user = await entityFactory.createRandUser();

      const sessionUser: SessionUser = {
        id: user.id,
        isLoggedIn: true,
        role: user.role,
      };

      const { res } = await whoami(sessionUser);

      expect(res.data).not.toBeNull();
      expect(res.data.whoami).not.toBeNull();
      expect(res.data!.whoami!.id).toBe(sessionUser.id);
    });
  });

  describe('login', () => {
    let user: User;
    let password: string;

    beforeEach(async () => {
      const username = randStr(10);
      const email = `${username}@domain.tld`;
      password = randStr(10);

      const authService = container.get<AuthService>(TYPES.AuthService);
      user = await authService.signup(username, email, password);
    });

    const login = async (input: LoginInput, sessionUser?: SessionUser) => {
      return resolve<Mutation, 'login'>(
        gql`
          mutation login($input: LoginInput!) {
            login(input: $input) {
              id
            }
          }
        `,
        { input },
        { sessionUser }
      );
    };

    it('logs the user in using username and password', async () => {
      const { res, ctx } = await login({ usernameOrEmail: user.username, password });

      expect(res.errors).toBeUndefined();
      expect(res.data.login).not.toBeNull();
      expect(res.data.login!.id).toBe(user.id);

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeTrue();
      expect(sessionUser.id).toBe(user.id);
      expect(sessionUser.role).toBe(user.role);
    });

    it('logs the user in using email and password', async () => {
      const { res, ctx } = await login({ usernameOrEmail: user.email, password });

      expect(res.errors).toBeUndefined();
      expect(res.data.login).not.toBeNull();
      expect(res.data.login!.id).toBe(user.id);

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeTrue();
      expect(sessionUser.id).toBe(user.id);
      expect(sessionUser.role).toBe(user.role);
    });

    it('does not log the user in when wrong password', async () => {
      const wrongPassword = randStr(password.length + 1);
      const { res, ctx } = await login({ usernameOrEmail: user.username, password: wrongPassword });

      expect(res.errors).toBeDefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBe(false);
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });

    it('returns errors when already logged in', async () => {
      const { res, ctx } = await login(
        { usernameOrEmail: user.username, password },
        { id: user.id, isLoggedIn: true, role: user.role }
      );

      expect(res.errors).toBeDefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeTrue();
      expect(sessionUser.id).toBe(user.id);
      expect(sessionUser.role).toBe(user.role);
    });
  });

  describe('logout', () => {
    let user: User;
    let password: string;

    beforeEach(async () => {
      const username = randStr(10);
      const email = `${username}@domain.tld`;
      password = randStr(10);

      const authService = container.get<AuthService>(TYPES.AuthService);
      user = await authService.signup(username, email, password);
    });

    const logout = (sessionUser?: SessionUser) => {
      return resolve(
        gql`
          mutation {
            logout
          }
        `,
        {},
        { sessionUser }
      );
    };

    it('logs a user out', async () => {
      const { res, ctx } = await logout({ id: user.id, isLoggedIn: true, role: user.role });

      expect(res.errors).toBeUndefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeFalse();
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });

    it('returns errors when already logged out', async () => {
      const { res, ctx } = await logout();

      expect(res.errors).toBeDefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeFalse();
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });
  });
});
