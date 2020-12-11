import { Connection, ConnectionArgs } from '@stringsync/common';
import { inject, injectable } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { REPOS, UserRepo } from '@stringsync/repos';

const TYPES = { ...REPOS.TYPES };

@injectable()
export class UserService {
  userRepo: UserRepo;

  constructor(@inject(TYPES.UserRepo) userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return await this.userRepo.findByUsernameOrEmail(usernameOrEmail);
  }

  async find(id: string): Promise<User | null> {
    return await this.userRepo.find(id);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.findAll();
  }

  async findPage(connectionArgs: ConnectionArgs): Promise<Connection<User>> {
    return await this.userRepo.findPage(connectionArgs);
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    return await this.userRepo.update(id, attrs);
  }
}
