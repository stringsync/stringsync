import { UserRepo } from '@stringsync/repos';
import * as domain from '@stringsync/domain';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';

@injectable()
export class UserService {
  readonly userRepo: UserRepo;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async find(id: number): Promise<domain.User | null> {
    return await this.userRepo.find(id);
  }

  async findAll(): Promise<domain.User[]> {
    return await this.userRepo.findAll();
  }
}
