import { UserRepo } from '@stringsync/repos';
import { User } from '@stringsync/domain';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';

@injectable()
export class UserService {
  readonly userRepo: UserRepo;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async find(id: string): Promise<User | null> {
    return await this.userRepo.find(id);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.findAll();
  }
}
