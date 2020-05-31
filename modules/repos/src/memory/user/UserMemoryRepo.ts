import { MemoryRepo } from '../MemoryRepo';
import { User } from '@stringsync/domain';
import { UserRepo } from '../../UserRepo';

export class UserMemoryRepo extends MemoryRepo<User> implements UserRepo {
  getId(user: User) {
    return user.id;
  }
}
