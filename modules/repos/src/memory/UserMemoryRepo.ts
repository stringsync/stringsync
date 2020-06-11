import '@stringsync/container';
import { MemoryRepo } from './MemoryRepo';
import { User } from '@stringsync/domain';
import { UserRepo } from '../types';
import { injectable } from 'inversify';

@injectable()
export class UserMemoryRepo extends MemoryRepo<User> implements UserRepo {
  getId(user: User) {
    return user.id;
  }

  async findByUsernameOrEmail(usernameOrEmail: string) {
    const users = await this.findAll();
    return users.find((user) => user.email === usernameOrEmail || user.username === usernameOrEmail) || null;
  }
}
