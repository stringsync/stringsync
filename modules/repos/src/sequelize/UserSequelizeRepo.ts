import { UserModel } from '@stringsync/sequelize';
import { User } from '@stringsync/domain';
import { UserRepo } from './../types';
import { injectable } from 'inversify';
import { or } from 'sequelize';

@injectable()
export class UserSequelizeRepo implements UserRepo {
  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return await UserModel.findOne({
      where: { ...or({ username: usernameOrEmail }, { email: usernameOrEmail }) },
      raw: true,
    });
  }

  async find(id: string): Promise<User | null> {
    return await UserModel.findByPk(id, { raw: true });
  }

  async findAll(): Promise<User[]> {
    return await UserModel.findAll({ raw: true });
  }

  async create(attrs: Partial<User>): Promise<User> {
    return await UserModel.create(attrs, { raw: true });
  }

  async update(attrs: Partial<User>): Promise<void> {
    if (!attrs.id) {
      throw new Error('no id specified');
    }
    return await UserModel.update(attrs, { where: { id: attrs.id } });
  }

  async destroyAll(): Promise<void> {
    await UserModel.destroy({ where: {}, truncate: true });
  }
}
