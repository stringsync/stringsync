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
  readonly userRepo: UserRepo;

  static HASH_ROUNDS = 10;

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
    if (!id) {
      return null;
    }
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
    const encryptedPassword = await bcrypt.hash(password, AuthService.HASH_ROUNDS);
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
    await this.userRepo.update(confirmedUser);

    return confirmedUser;
  }

  async resetConfirmationToken(id: string): Promise<void> {
    const user = await this.userRepo.find(id);

    // Fail silently to not let a client know the confirmation
    // state of the user.
    if (!user) {
      return;
    }
    if (user.confirmedAt) {
      return;
    }

    user.confirmationToken = uuid.v4();
    await this.userRepo.update(user);
  }
}
