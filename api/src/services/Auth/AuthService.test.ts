import * as bcrypt from 'bcrypt';
import { isPlainObject } from 'lodash';
import * as uuid from 'uuid';
import { User, UserRole } from '../../domain';
import { BadRequestError, NotFoundError } from '../../errors';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import { rand } from '../../util';
import { AuthService } from './AuthService';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepo: UserRepo;

  beforeEach(() => {
    authService = container.get<AuthService>(TYPES.AuthService);
    userRepo = authService.userRepo;
  });

  describe('getSessionUser', () => {
    it('returns a null session user when the id is empty', async () => {
      const sessionUser = await authService.getSessionUser('');

      expect(sessionUser).toStrictEqual({
        id: '',
        role: UserRole.STUDENT,
        isLoggedIn: false,
      });
    });

    it('returns a null session user when the id does not exist', async () => {
      const sessionUser = await authService.getSessionUser('');

      expect(sessionUser).toStrictEqual({
        id: '',
        role: UserRole.STUDENT,
        isLoggedIn: false,
      });
    });

    it('returns a session user when the id exists', async () => {
      const user = await authService.userRepo.create(rand.user());
      const sessionUser = await authService.getSessionUser(user.id);
      expect(sessionUser).toStrictEqual({
        id: user.id,
        role: user.role,
        isLoggedIn: true,
      });
    });
  });

  describe('toSessionUser', () => {
    it('converts a user to a session user', () => {
      const user = rand.user();
      const sessionUser = authService.toSessionUser(user);
      expect(sessionUser).toStrictEqual({
        id: user.id,
        role: user.role,
        isLoggedIn: true,
      });
    });

    it('converts null to a session user', () => {
      const sessionUser = authService.toSessionUser(null);
      expect(sessionUser).toStrictEqual({
        id: '',
        role: UserRole.STUDENT,
        isLoggedIn: false,
      });
    });
  });

  describe('whoami', () => {
    it('returns null when no id', async () => {
      const whoami = await authService.whoami('');
      expect(whoami).toBeNull();
    });

    it('returns the user matching the id', async () => {
      const user = await userRepo.create(rand.user());
      const whoami = await authService.whoami(user.id);
      expect(whoami).toStrictEqual(user);
    });

    it('returns null if a user does not match the id', async () => {
      const whoami = await authService.whoami(rand.str(10));
      expect(whoami).toBeNull();
    });
  });

  describe('getAuthenticatedUser', () => {
    let password: string;
    let user: User;

    beforeEach(async () => {
      const username = rand.str(10);
      const email = `${rand.str(8)}@${rand.str(8)}.com`;
      password = rand.str(10);
      user = await authService.signup(username, email, password);
    });

    it('returns the user matching the username and password', async () => {
      const authenticatedUser = await authService.getAuthenticatedUser(user.username, password);
      expect(authenticatedUser).toStrictEqual(user);
    });

    it('returns the user matching the email and password', async () => {
      const authenticatedUser = await authService.getAuthenticatedUser(user.email, password);
      expect(authenticatedUser).toStrictEqual(user);
    });

    it('returns null if the username and password combo is wrong', async () => {
      const authenticatedUser = await authService.getAuthenticatedUser(user.username, rand.str(11));
      expect(authenticatedUser).toBeNull();
    });

    it('returns null if the email and password combo is wrong', async () => {
      const authenticatedUser = await authService.getAuthenticatedUser(user.email, rand.str(11));
      expect(authenticatedUser).toBeNull();
    });

    it('returns null if the username or email does not exist', async () => {
      const authenticatedUser = await authService.getAuthenticatedUser(rand.str(10), password);
      expect(authenticatedUser).toBeNull();
    });
  });

  describe('signup', () => {
    let username: string;
    let email: string;
    let password: string;

    beforeEach(() => {
      username = rand.str(10);
      email = `${rand.str(8)}@${rand.str(8)}.com`;
      password = rand.str(10);
    });

    it('returns a user', async () => {
      const user = await authService.signup(username, email, password);
      expect(user.username).toBe(username);
      expect(user.email).toBe(email);
      await expect(bcrypt.compare(password, user.encryptedPassword)).resolves.toBe(true);
    });

    it('persists a user', async () => {
      const { id } = await authService.signup(username, email, password);
      const user = await userRepo.find(id);
      expect(user).not.toBeNull();
      expect(user!.id).toBe(id);
    });
  });

  describe('confirmEmail', () => {
    let user: User;
    let confirmedAt: Date;

    beforeEach(async () => {
      const username = rand.str(10);
      const email = `${rand.str(8)}@${rand.str(8)}.com`;
      const password = rand.str(10);
      user = await authService.signup(username, email, password);
      confirmedAt = new Date();
    });

    it('persists confirmed at and unsets confirmation token', async () => {
      await authService.confirmEmail(user.id, user.confirmationToken!, confirmedAt);

      const foundUser = await userRepo.find(user.id);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.confirmedAt).toStrictEqual(confirmedAt);
      expect(foundUser!.confirmationToken).toBeNull();
    });

    it('throws an error if user is not found', async () => {
      await expect(authService.confirmEmail(rand.str(10), user.confirmationToken!, confirmedAt)).rejects.toThrowError(
        NotFoundError
      );
    });

    it('throws an error if user is already confirmed', async () => {
      await expect(authService.confirmEmail(user.id, user.confirmationToken!, confirmedAt)).resolves.not.toThrow();
      await expect(authService.confirmEmail(user.id, user.confirmationToken!, confirmedAt)).rejects.toThrowError(
        BadRequestError
      );
    });

    it('throws an error if no confirmationToken is provided', async () => {
      await expect(authService.confirmEmail(user.id, '', confirmedAt)).rejects.toThrowError(BadRequestError);
    });

    it('throws an error if the confirmationToken does not match', async () => {
      await expect(
        authService.confirmEmail(user.id, 'impossible-confirmation-token', confirmedAt)
      ).rejects.toThrowError(BadRequestError);
    });
  });

  describe('resetConfirmationToken', () => {
    let user: User;

    beforeEach(async () => {
      const username = rand.str(10);
      const email = `${rand.str(8)}@${rand.str(8)}.com`;
      const password = rand.str(10);
      user = await authService.signup(username, email, password);
    });

    it('returns a user with a different confirmationToken', async () => {
      const resetConfirmationTokenUser = await authService.resetConfirmationToken(user.id);
      expect(resetConfirmationTokenUser).not.toBeNull();
      expect(resetConfirmationTokenUser!.confirmationToken).not.toStrictEqual(user.confirmationToken);
    });

    it('persists a user with a different confirmationToken', async () => {
      await authService.resetConfirmationToken(user.id);
      const foundUser = await userRepo.find(user.id);
      expect(foundUser).not.toBeNull();
      expect(foundUser!.confirmationToken).not.toBe(user.confirmationToken);
    });

    it('throws when user does not exist', async () => {
      await expect(authService.resetConfirmationToken(rand.str(10))).rejects.toThrow();
    });

    it('throws when user is already confirmed', async () => {
      await authService.confirmEmail(user.id, user.confirmationToken!, new Date());
      await expect(authService.resetConfirmationToken(rand.str(10))).rejects.toThrow();
    });
  });

  describe('refreshResetPasswordToken', () => {
    let user: User;
    const reqAt = new Date();

    beforeEach(async () => {
      const username = rand.str(10);
      const email = `${rand.str(8)}@${rand.str(8)}.com`;
      const password = rand.str(10);
      user = await authService.signup(username, email, password);
    });

    it('sets a resetPasswordToken', async () => {
      const resetPasswordTokenUser = await authService.refreshResetPasswordToken(user.email, reqAt);
      expect(resetPasswordTokenUser).not.toBeNull();
      expect(resetPasswordTokenUser!.resetPasswordToken).not.toBeNull();
      expect(resetPasswordTokenUser!.resetPasswordTokenSentAt).toBe(reqAt);
    });

    it('resets a resetPasswordToken', async () => {
      const resetPasswordTokenUser1 = await authService.refreshResetPasswordToken(user.email, reqAt);
      const resetPasswordTokenUser2 = await authService.refreshResetPasswordToken(user.email, reqAt);

      expect(resetPasswordTokenUser1).not.toBeNull();
      expect(resetPasswordTokenUser2).not.toBeNull();

      expect(resetPasswordTokenUser2!.resetPasswordToken).not.toBeNull();
      expect(resetPasswordTokenUser2!.resetPasswordToken).not.toBe(resetPasswordTokenUser1!.resetPasswordToken);
    });

    it('throws for an invalid email', async () => {
      await expect(authService.refreshResetPasswordToken(rand.str(10), reqAt)).rejects.toThrow();
    });

    it('returns a plain object', async () => {
      const resetPasswordTokenUser = await authService.refreshResetPasswordToken(user.email, reqAt);
      expect(resetPasswordTokenUser).not.toBeNull();
      expect(isPlainObject(resetPasswordTokenUser)).toBe(true);
    });
  });

  describe('resetPassword', () => {
    let user: User;
    let email: string;
    let oldPassword: string;
    let newPassword: string;
    const reqAt = new Date();

    beforeEach(async () => {
      const username = rand.str(10);
      email = `${rand.str(8)}@${rand.str(8)}.com`;
      oldPassword = rand.str(10);
      newPassword = rand.str(11);
      user = await authService.signup(username, email, oldPassword);
    });

    it('updates a password', async () => {
      const { resetPasswordToken } = await authService.refreshResetPasswordToken(email, new Date());
      const resetPasswordUser = await authService.resetPassword(email, resetPasswordToken!, newPassword, reqAt);
      expect(resetPasswordUser.encryptedPassword).not.toBe(user.encryptedPassword);

      // try logging in with the new password
      const authenticatedUser1 = await authService.getAuthenticatedUser(email, newPassword);
      expect(authenticatedUser1).not.toBeNull();

      // ensure old password doesn't work
      const authenticatedUser2 = await authService.getAuthenticatedUser(email, oldPassword);
      expect(authenticatedUser2).toBeNull();
    });

    it('throws if the resetPasswordToken is invalid', async () => {
      const invalidResetPasswordToken = uuid.v4();
      await expect(authService.resetPassword(email, invalidResetPasswordToken, newPassword, reqAt)).rejects.toThrow();
    });

    it('throws if the resetPasswordTokenSentAt is missing', async () => {
      const reqPasswordResetUser = await authService.refreshResetPasswordToken(email, new Date());
      // in theory this kind of update should never happen
      await userRepo.update(reqPasswordResetUser.id, { ...reqPasswordResetUser, resetPasswordTokenSentAt: null });

      await expect(
        authService.resetPassword(email, reqPasswordResetUser.resetPasswordToken!, newPassword, reqAt)
      ).rejects.toThrow();
    });

    it('throws if the resetPasswordToken is too old', async () => {
      const resetPasswordTokenSentAt = new Date(reqAt.getTime() - AuthService.MAX_RESET_PASSWORD_TOKEN_AGE_MS - 1);
      const { resetPasswordToken } = await authService.refreshResetPasswordToken(email, resetPasswordTokenSentAt);
      await expect(authService.resetPassword(email, resetPasswordToken!, newPassword, reqAt)).rejects.toThrow();
    });
  });
});
