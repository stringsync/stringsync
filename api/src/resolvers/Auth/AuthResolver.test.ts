import { UserRole } from '../../domain';
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
    let authService: AuthService;

    let username: string;
    let email: string;
    let password: string;

    beforeEach(async () => {
      username = randStr(10);
      email = `${username}@domain.tld`;
      password = randStr(10);

      authService = container.get<AuthService>(TYPES.AuthService);
    });

    const login = async (input: LoginInput) => {
      return resolve<Mutation, 'login'>(
        gql`
          mutation login($input: LoginInput!) {
            login(input: $input) {
              id
            }
          }
        `,
        { input }
      );
    };

    it('logs the user in using username and password', async () => {
      const user = await authService.signup(username, email, password);

      const { res, ctx } = await login({ usernameOrEmail: username, password });

      expect(res.errors).toBeUndefined();
      expect(res.data.login).not.toBeNull();
      expect(res.data.login!.id).toBe(user.id);

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeTrue();
      expect(sessionUser.id).toBe(user.id);
      expect(sessionUser.role).toBe(user.role);
    });

    it('logs the user in using email and password', async () => {
      const user = await authService.signup(username, email, password);

      const { res, ctx } = await login({ usernameOrEmail: email, password });

      expect(res.errors).toBeUndefined();
      expect(res.data.login).not.toBeNull();
      expect(res.data.login!.id).toBe(user.id);

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBeTrue();
      expect(sessionUser.id).toBe(user.id);
      expect(sessionUser.role).toBe(user.role);
    });

    it('does not log the user in when wrong password', async () => {
      const user = await authService.signup(username, email, password);

      const wrongPassword = randStr(password.length + 1);
      const { res, ctx } = await login({ usernameOrEmail: username, password: wrongPassword });

      expect(res.errors).toBeDefined();

      const sessionUser = ctx.getSessionUser();
      expect(sessionUser.isLoggedIn).toBe(false);
      expect(sessionUser.id).toBeEmpty();
      expect(sessionUser.role).toBe(UserRole.STUDENT);
    });
  });
});
