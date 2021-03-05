import { inject, injectable } from 'inversify';
import { User } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import { Connection, ConnectionArgs } from '../../util';

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserRepo) public userRepo: UserRepo) {}

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
