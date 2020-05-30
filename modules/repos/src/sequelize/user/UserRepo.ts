import { User } from '@stringsync/domain';
import { SequelizeRepo } from '../SequelizeRepo';
import { Db } from '../Db';

export class UserRepo extends SequelizeRepo<User> {
  public readonly db: Db;

  constructor(db: Db) {
    super();
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
