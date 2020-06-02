import { User } from '@stringsync/domain';
import { Db } from '@stringsync/sequelize';
import { UserRepo } from '../UserRepo';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/common';

@injectable()
export class UserSequelizeRepo implements UserRepo {
  public readonly db: Db;

  constructor(@inject(TYPES.Db) db: Db) {
    this.db = db;
  }

  async get(id: string) {
    return (await this.db.User.findByPk(id, { raw: true })) as User | null;
  }

  async create(user: User) {
    return (await this.db.User.create(user, { raw: true })) as User;
  }

  async update(user: User) {
    await this.db.User.update(user, { where: { id: user.id } });
  }
}
