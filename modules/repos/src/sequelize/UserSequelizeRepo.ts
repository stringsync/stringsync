import { UserRepo } from '../types';
import { injectable, inject } from 'inversify';
import { User } from '@stringsync/domain';
import { SequelizeRepo } from './SequelizeRepo';
import { UserModel, StaticModel } from '@stringsync/sequelize';

@injectable()
export class UserSequelizeRepo extends SequelizeRepo<User, StaticModel<UserModel>> implements UserRepo {
  get model() {
    return this.db.User;
  }
}
