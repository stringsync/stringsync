import { inject, injectable } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserRepo } from '@stringsync/repos';
import * as domain from '@stringsync/domain';

@injectable()
export class UserService {
  readonly userRepo: UserRepo;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async find(id: string): Promise<domain.User | null> {
    return await this.userRepo.find(id);
  }

  async findAll(): Promise<domain.User[]> {
    return await this.userRepo.findAll();
  }
}
