import { injectable, inject } from 'inversify';
import { UserRepo } from '@stringsync/repos';
import { TYPES } from '@stringsync/container';
import { SessionUser } from './types';
import { User, UserRole } from '@stringsync/domain';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { BadRequestError, NotFoundError } from '@stringsync/common';

@injectable()
export class AuthService {
  static MAX_RESET_PASSWORD_TOKEN_AGE_MS = 86400 * 1000; // 1 day
  static MIN_PASSWORD_LENGTH = 6;
  static HASH_ROUNDS = 10;

  userRepo: UserRepo;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async getSessionUser(id: string): Promise<SessionUser> {
    const user = await this.userRepo.find(id);
    return this.toSessionUser(user);
  }

  toSessionUser(user: User | null): SessionUser {
    if (user) {
      return { id: user.id, role: user.role, isLoggedIn: true };
    }
    return { id: '', role: UserRole.STUDENT, isLoggedIn: false };
  }

  async whoami(id: string): Promise<User | null> {
    return await this.userRepo.find(id);
  }

  async getAuthenticatedUser(usernameOrEmail: string, password: string): Promise<User | null> {
    const user = await this.userRepo.findByUsernameOrEmail(usernameOrEmail);
    if (!user) {
      return null;
    }
    const isPassword = await bcrypt.compare(password, user.encryptedPassword);
    return isPassword ? user : null;
  }

  async signup(username: string, email: string, password: string): Promise<User> {
    const encryptedPassword = await this.validateAndEncryptPassword(password);
    const confirmationToken = uuid.v4();

    const user = await this.userRepo.create({
      username,
      email,
      encryptedPassword,
      confirmationToken,
    });

    return user;
  }

  async confirmEmail(id: string, confirmationToken: string, confirmedAt: Date): Promise<User> {
    const user = await this.userRepo.find(id);
    if (!user) {
      throw new NotFoundError('user not found');
    }
    if (user.confirmedAt) {
      throw new BadRequestError('invalid confirmation token');
    }
    if (!confirmationToken) {
      throw new BadRequestError('invalid confirmation token');
    }
    if (user.confirmationToken !== confirmationToken) {
      throw new BadRequestError('invalid confirmation token');
    }

    const confirmedUser = { ...user, confirmationToken: null, confirmedAt };
    await this.userRepo.update(confirmedUser.id, confirmedUser);

    return confirmedUser;
  }

  async resetConfirmationToken(id: string): Promise<User> {
    const user = await this.userRepo.find(id);
    if (!user) {
      throw new NotFoundError('user not found');
    }
    if (user.confirmedAt) {
      throw new BadRequestError('user already confirmed');
    }

    const updatedUser: User = { ...user, confirmationToken: uuid.v4() };
    await this.userRepo.update(updatedUser.id, updatedUser);

    return updatedUser;
  }

  async refreshResetPasswordToken(email: string, reqAt: Date): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new NotFoundError('user not found');
    }

    const updatedUser: User = { ...user, resetPasswordToken: uuid.v4(), resetPasswordTokenSentAt: reqAt };
    await this.userRepo.update(updatedUser.id, updatedUser);

    return updatedUser;
  }

  async resetPassword(resetPasswordToken: string, password: string, reqAt: Date): Promise<User> {
    const user = await this.userRepo.findByResetPasswordToken(resetPasswordToken);
    if (!user) {
      throw new NotFoundError('user not found');
    }
    if (!user.resetPasswordTokenSentAt) {
      // user is in a bad state somehow, have them request another token
      throw new BadRequestError('invalid reset password token');
    }

    const resetPasswordTokenAgeMs = reqAt.getTime() - user.resetPasswordTokenSentAt.getTime();
    if (resetPasswordTokenAgeMs > AuthService.MAX_RESET_PASSWORD_TOKEN_AGE_MS) {
      throw new BadRequestError('invalid reset password token');
    }

    const encryptedPassword = await this.validateAndEncryptPassword(password);
    const updatedUser: User = { ...user, resetPasswordToken: null, resetPasswordTokenSentAt: null, encryptedPassword };
    await this.userRepo.update(updatedUser.id, updatedUser);

    return updatedUser;
  }

  private async validateAndEncryptPassword(password: string): Promise<string> {
    if (password.length < AuthService.MIN_PASSWORD_LENGTH) {
      throw new BadRequestError(`password must be at least ${AuthService.MIN_PASSWORD_LENGTH} characters`);
    }
    return await bcrypt.hash(password, AuthService.HASH_ROUNDS);
  }
}
