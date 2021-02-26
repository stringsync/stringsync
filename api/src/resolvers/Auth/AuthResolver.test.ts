import { User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { SessionUser } from '../../server';
import { AuthService, UserService } from '../../services';
import { ConfirmEmailInput, EntityFactory, gql, LoginInput, Mutation, Query, resolve } from '../../testing';
import { randStr } from '../../util';

enum LoginStatus {
  LOGGED_OUT = 'LOGGED_OUT',
  LOGGED_IN = 'LOGGED_IN',
}

describe('AuthResolver', () => {
  const getSessionUser = (loginStatus: LoginStatus, user: User): SessionUser | undefined => {
    switch (loginStatus) {
      case LoginStatus.LOGGED_OUT:
        return undefined;
      case LoginStatus.LOGGED_IN:
        return {
          id: user.id,
          isLoggedIn: true,
          role: user.role,
        };
      default:
        throw new Error(`unhandled login status: ${loginStatus}`);
    }
  };

  describe('whoami', () => {
    let user: User;

    beforeEach(async () => {
      const entityFactory = container.get<EntityFactory>(TYPES.EntityFactory);
      user = await entityFactory.createRandUser();
    });

    const whoami = async (loginStatus: LoginStatus) => {
      return resolve<Query, 'whoami'>(
        gql`
          query {
            whoami {
              id
            }
          }
        `,
        {},
        { sessionUser: getSessionUser(loginStatus, user) }
      );
    };

    it('returns null when logged out', async () => {
      const { res } = await whoami(LoginStatus.LOGGED_OUT);

      expect(res.data.whoami).toBeNull();
    });

    it('returns the session user when logged in', async () => {
      const { res, ctx } = await whoami(LoginStatus.LOGGED_IN);

      const sessionUser = ctx.getSessionUser();
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

    const login = async (input: LoginInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'login'>(
        gql`
          mutation login($input: LoginInput!) {
            login(input: $input) {
              id
            }
          }
        `,
        { input },
        { sessionUser: getSessionUser(loginStatus, user) }
      );
    };

    it('logs the user in using username and password', async () => {
      const { res, ctx } = await login({ usernameOrEmail: user.username, password }, LoginStatus.LOGGED_OUT);

      expect(res.errors).toBeUndefined();
      expect(res.data.login).not.toBeNull();
      expect(res.data.login!.id).toBe(user.id);

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeTrue();
      expect(sessionUser.id).toBe(user.id);
      expect(sessionUser.role).toBe(user.role);
    });

    it('logs the user in using email and password', async () => {
      const { res, ctx } = await login({ usernameOrEmail: user.email, password }, LoginStatus.LOGGED_OUT);

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
      const { res, ctx } = await login(
        { usernameOrEmail: user.username, password: wrongPassword },
        LoginStatus.LOGGED_OUT
      );

      expect(res.errors).toBeDefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBe(false);
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });

    it('returns errors when already logged in', async () => {
      const { res, ctx } = await login({ usernameOrEmail: user.username, password }, LoginStatus.LOGGED_IN);

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

    const logout = (loginStatus: LoginStatus) => {
      return resolve<Mutation, 'logout'>(
        gql`
          mutation {
            logout
          }
        `,
        {},
        { sessionUser: getSessionUser(loginStatus, user) }
      );
    };

    it('logs a user out', async () => {
      const { res, ctx } = await logout(LoginStatus.LOGGED_IN);

      expect(res.errors).toBeUndefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeFalse();
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });

    it('returns errors when already logged out', async () => {
      const { res, ctx } = await logout(LoginStatus.LOGGED_OUT);

      expect(res.errors).toBeDefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeFalse();
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });
  });

  describe('confirmEmail', () => {
    let user: User;
    let password: string;

    beforeEach(async () => {
      const username = randStr(10);
      const email = `${username}@domain.tld`;
      password = randStr(10);

      const authService = container.get<AuthService>(TYPES.AuthService);
      user = await authService.signup(username, email, password);

      expect(user.confirmationToken).not.toBeNull();
    });

    const confirmEmail = (input: ConfirmEmailInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'confirmEmail', { input: ConfirmEmailInput }>(
        gql`
          mutation confirmEmail($input: ConfirmEmailInput!) {
            confirmEmail(input: $input) {
              confirmedAt
            }
          }
        `,
        { input },
        { sessionUser: getSessionUser(loginStatus, user) }
      );
    };

    it('sets confirmed at for the logged in user', async () => {
      const { res } = await confirmEmail({ confirmationToken: user.confirmationToken! }, LoginStatus.LOGGED_IN);

      expect(res.errors).toBeUndefined();
      expect(res.data.confirmEmail).not.toBeNull();

      const userService = container.get<UserService>(TYPES.UserService);
      const reloadedUser = await userService.find(user.id);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.confirmedAt).not.toBeNull();
      expect(res.data.confirmEmail!.confirmedAt).toBe(reloadedUser!.confirmedAt!.toISOString());
    });

    it('returns errors for the wrong confirmation token', async () => {
      const { res } = await confirmEmail({ confirmationToken: randStr(5) }, LoginStatus.LOGGED_IN);

      expect(res.errors).toBeDefined();
    });

    it('returns errors when not logged in', async () => {
      const { res } = await confirmEmail({ confirmationToken: user.confirmationToken! }, LoginStatus.LOGGED_OUT);

      expect(res.errors).toBeDefined();
    });
  });
});
