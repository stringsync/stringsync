import { UserRepo } from '../types';
import { injectable, inject } from 'inversify';
import { User } from '@stringsync/domain';
import { SequelizeRepo } from './SequelizeRepo';
import { UserModel } from '@stringsync/sequelize';

@injectable()
export class UserSequelizeRepo extends SequelizeRepo<User, UserModel> implements UserRepo {
  get model() {
    return this.db.User;
  }

  get idName() {
    return 'id';
  }

  getId(user: User) {
    return user.id;
  }
}
