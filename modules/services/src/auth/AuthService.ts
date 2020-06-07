import { injectable, inject } from 'inversify';
import { UserRepo } from '@stringsync/repos';
import { TYPES } from '@stringsync/container';
import { SessionUser } from './types';
import { User, UserRole } from '@stringsync/domain';

@injectable()
export class AuthService {
  readonly userRepo: UserRepo;

  private static toSessionUser(user: User | null): SessionUser {
    if (user) {
      return { id: user.id, role: user.role, isLoggedIn: true };
    }
    return { id: '', role: UserRole.STUDENT, isLoggedIn: false };
  }

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async getSessionUser(id: string): Promise<SessionUser> {
    const user = await this.userRepo.find(id);
    return AuthService.toSessionUser(user);
  }

  async whoami(id: string): Promise<User | null> {
    if (!id) {
      return null;
    }
    return await this.userRepo.find(id);
  }
}
