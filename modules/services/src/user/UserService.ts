import { UserRepo } from '@stringsync/repos';
import * as domain from '@stringsync/domain';

export class UserService {
  readonly userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async find(id: string): Promise<domain.User | null> {
    return await this.userRepo.find(id);
  }

  async findAll(): Promise<domain.User[]> {
    return await this.userRepo.findAll();
  }
}
