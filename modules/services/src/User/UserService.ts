import Dataloader from 'dataloader';
import { UserRepo } from '@stringsync/repos';
import { User } from '@stringsync/domain';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';
import { ConnectionArgs, Connection } from '@stringsync/common';

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
}
