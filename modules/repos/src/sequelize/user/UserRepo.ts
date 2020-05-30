import { User } from '@stringsync/domain';
import { SequelizeRepo } from '../SequelizeRepo';
import { Db } from '../Db';
import { defineUserModel } from './defineUserModel';

export class UserRepo implements SequelizeRepo<User> {
  public readonly db: Db;

  constructor(db: Db) {
    this.db = db;
  }

  async connect() {
    defineUserModel(this.db.sequelize);
  }

  async create(user: User) {}

  async update(user: User) {}
}
