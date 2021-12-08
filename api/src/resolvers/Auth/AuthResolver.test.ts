import { User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { SendMail } from '../../jobs';
import { SessionUser } from '../../server';
import { AuthService, UserService } from '../../services';
import { ConfirmEmailInput, createRandUser, gql, LoginInput, Mutation, Query, resolve } from '../../testing';
import { rand } from '../../util';
import { BadRequestError, ForbiddenError } from '../graphqlTypes';
import { EmailConfirmation } from './ConfirmEmailOutput';
import { ResetPasswordInput } from './ResetPasswordInput';
import { SendResetPasswordEmailInput } from './SendResetPasswordEmailInput';

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
      user = await createRandUser();
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
      const username = rand.str(10);
      const email = `${username}@domain.tld`;
      password = rand.str(10);

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
      const wrongPassword = rand.str(password.length + 1);
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
      const username = rand.str(10);
      const email = `${username}@domain.tld`;
      password = rand.str(10);

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

    beforeEach(async () => {
      const username = rand.str(10);
      const email = `${username}@domain.tld`;
      const password = rand.str(10);

      const authService = container.get<AuthService>(TYPES.AuthService);
      user = await authService.signup(username, email, password);

      expect(user.confirmationToken).not.toBeNull();
    });

    const confirmEmail = (input: ConfirmEmailInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'confirmEmail', { input: ConfirmEmailInput }>(
        gql`
          mutation confirmEmail($input: ConfirmEmailInput!) {
            confirmEmail(input: $input) {
              __typename
              ... on EmailConfirmation {
                confirmedAt
              }
              ... on ForbiddenError {
                message
              }
              ... on BadRequestError {
                message
              }
              ... on NotFoundError {
                message
              }
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
      expect(res.data.confirmEmail).not.toBeNull();
      expect(res.data.confirmEmail!.__typename).toBe('EmailConfirmation');
      const emailConfirmation = res.data.confirmEmail as EmailConfirmation;
      expect(emailConfirmation.confirmedAt).toBe(reloadedUser!.confirmedAt!.toISOString());
    });

    it('returns error for the wrong confirmation token', async () => {
      const { res } = await confirmEmail({ confirmationToken: rand.str(5) }, LoginStatus.LOGGED_IN);

      expect(res.errors).toBeUndefined();
      expect(res.data.confirmEmail).not.toBeNull();
      expect(res.data.confirmEmail!.__typename).toBe('BadRequestError');
      const badRequestError = res.data.confirmEmail! as BadRequestError;
      expect(badRequestError.message).toBe('invalid confirmation token');
    });

    it('returns error when not logged in', async () => {
      const { res } = await confirmEmail({ confirmationToken: user.confirmationToken! }, LoginStatus.LOGGED_OUT);

      expect(res.errors).toBeUndefined();
      expect(res.data.confirmEmail).not.toBeNull();
      expect(res.data.confirmEmail!.__typename).toBe('ForbiddenError');
      const badRequestError = res.data.confirmEmail! as ForbiddenError;
      expect(badRequestError.message).toBe('must be logged in');
    });
  });

  describe('resendConfirmationEmail', () => {
    let userService: UserService;
    let authService: AuthService;
    let sendMailSpy: jest.SpyInstance;

    let user: User;

    beforeEach(() => {
      userService = container.get<UserService>(TYPES.UserService);
      authService = container.get<AuthService>(TYPES.AuthService);
      sendMailSpy = jest
        .spyOn(container.get<SendMail>(TYPES.SendMail).job, 'enqueue')
        .mockImplementation((payload) => Promise.resolve());
    });

    beforeEach(async () => {
      const username = rand.str(10);
      const email = `${username}@domain.tld`;
      const password = rand.str(10);

      const authService = container.get<AuthService>(TYPES.AuthService);
      user = await authService.signup(username, email, password);

      expect(user.confirmationToken).not.toBeNull();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const resendConfirmationEmail = (loginStatus: LoginStatus) => {
      return resolve<Mutation, 'resendConfirmationEmail'>(
        gql`
          mutation resendConfirmationEmail {
            resendConfirmationEmail
          }
        `,
        {},
        { sessionUser: getSessionUser(loginStatus, user) }
      );
    };

    it('resets the logged in user confirmation token', async () => {
      const { res } = await resendConfirmationEmail(LoginStatus.LOGGED_IN);

      expect(res.errors).toBeUndefined();
      expect(res.data.resendConfirmationEmail).toBeTrue();

      const reloadedUser = await userService.find(user.id);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.confirmedAt).toBeNull();

      const beforeConfirmationToken = user.confirmationToken;
      const afterConfirmationToken = reloadedUser!.confirmationToken;
      expect(beforeConfirmationToken).not.toBeNull();
      expect(afterConfirmationToken).not.toBeNull();
      expect(afterConfirmationToken).not.toBe(beforeConfirmationToken);
    });

    it('sends a resend confirmation email', async () => {
      await resendConfirmationEmail(LoginStatus.LOGGED_IN);
      expect(sendMailSpy).toHaveBeenCalledTimes(1);
    });

    it('silently fails if already confirmed', async () => {
      const now = new Date();

      await authService.confirmEmail(user.id, user.confirmationToken!, now);

      const { res } = await resendConfirmationEmail(LoginStatus.LOGGED_IN);

      expect(res.errors).toBeUndefined();
      expect(res.data.resendConfirmationEmail).toBeTrue();

      const reloadedUser = await userService.find(user.id);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.confirmedAt!.getSeconds()).toBe(now.getSeconds());
      expect(reloadedUser!.confirmationToken).toBeNull();
    });

    it('does not send a resend confirmation email if already confirmed', async () => {
      const now = new Date();

      await authService.confirmEmail(user.id, user.confirmationToken!, now);

      await resendConfirmationEmail(LoginStatus.LOGGED_IN);

      expect(sendMailSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe('sendResetPasswordEmail', () => {
    let userService: UserService;
    let sendMailSpy: jest.SpyInstance;

    let user: User;

    beforeEach(async () => {
      userService = container.get<UserService>(TYPES.UserService);
      sendMailSpy = jest
        .spyOn(container.get<SendMail>(TYPES.SendMail).job, 'enqueue')
        .mockImplementation((payload) => Promise.resolve());
      user = await createRandUser();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    const sendResetPasswordEmail = (input: SendResetPasswordEmailInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'sendResetPasswordEmail', { input: SendResetPasswordEmailInput }>(
        gql`
          mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
            sendResetPasswordEmail(input: $input)
          }
        `,
        { input },
        { sessionUser: getSessionUser(loginStatus, user) }
      );
    };

    it('resets passwordResetToken when logged out', async () => {
      const { res } = await sendResetPasswordEmail({ email: user.email }, LoginStatus.LOGGED_OUT);

      expect(res.errors).toBeUndefined();
      expect(res.data.sendResetPasswordEmail).toBeTrue();

      const reloadedUser = await userService.find(user.id);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.resetPasswordToken!).not.toBeNull();
      expect(reloadedUser!.resetPasswordToken).not.toBe(user.resetPasswordToken);

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
    });

    it('resets passwordResetToken when logged in', async () => {
      const { res } = await sendResetPasswordEmail({ email: user.email }, LoginStatus.LOGGED_IN);

      expect(res.errors).toBeUndefined();
      expect(res.data.sendResetPasswordEmail).toBeTrue();

      const reloadedUser = await userService.find(user.id);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.resetPasswordToken!).not.toBeNull();
      expect(reloadedUser!.resetPasswordToken).not.toBe(user.resetPasswordToken);

      expect(sendMailSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPassword', () => {
    let authService: AuthService;
    let userService: UserService;

    let user: User;
    let password: string;

    beforeEach(async () => {
      userService = container.get<UserService>(TYPES.UserService);

      const username = rand.str(10);
      const email = `${username}@domain.tld`;
      password = rand.str(10);

      authService = container.get<AuthService>(TYPES.AuthService);

      user = await authService.signup(username, email, password);
    });

    const resetPassword = (input: ResetPasswordInput) => {
      return resolve<Mutation, 'resetPassword', { input: ResetPasswordInput }>(
        gql`
          mutation resetPassword($input: ResetPasswordInput!) {
            resetPassword(input: $input)
          }
        `,
        { input },
        {}
      );
    };

    it('updates the password', async () => {
      const oldPassword = password;
      const newPassword = rand.str(oldPassword.length + 1);

      const { resetPasswordToken } = await authService.refreshResetPasswordToken(user.email, new Date());
      expect(resetPasswordToken).not.toBeNull();

      const { res } = await resetPassword({
        email: user.email,
        password: newPassword,
        resetPasswordToken: resetPasswordToken!,
      });

      expect(res.errors).toBeUndefined();
      expect(res.data.resetPassword).toBeTrue();

      const oldPasswordUser = await authService.getAuthenticatedUser(user.email, oldPassword);
      expect(oldPasswordUser).toBeNull();

      const newPasswordUser = await authService.getAuthenticatedUser(user.email, newPassword);
      expect(newPasswordUser).not.toBeNull();
      expect(newPasswordUser!.id).toBe(user.id);
    });
  });
});
