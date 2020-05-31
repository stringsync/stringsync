import { MemoryRepo } from '../MemoryRepo';
import { User } from '@stringsync/domain';

export class UserRepo extends MemoryRepo<User> {
  getId(user: User) {
    return user.id;
  }
}
