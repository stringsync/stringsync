import { inject, injectable } from 'inversify';
import { TYPES } from '@stringsync/common';
import { UserRepo } from '@stringsync/repos';
import * as domain from '@stringsync/domain';

@injectable()
export class UserService {
  readonly userRepo: UserRepo;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async get(id: string): Promise<domain.User | null> {
    return await this.userRepo.get(id);
  }

  async all(): Promise<domain.User[]> {
    return await this.userRepo.all();
  }
}
