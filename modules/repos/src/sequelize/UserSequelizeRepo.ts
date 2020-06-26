import { TYPES } from '@stringsync/container';
import { UserModel } from '@stringsync/sequelize';
import { User } from '@stringsync/domain';
import { UserRepo } from './../types';
import { injectable, inject } from 'inversify';
import { or } from 'sequelize';

@injectable()
export class UserSequelizeRepo implements UserRepo {
  readonly userModel: typeof UserModel;

  constructor(@inject(TYPES.UserModel) userModel: typeof UserModel) {
    this.userModel = userModel;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    return await this.userModel.findOne({
      where: { ...or({ username: usernameOrEmail }, { email: usernameOrEmail }) },
      raw: true,
    });
  }

  async count(): Promise<number> {
    return await this.userModel.count();
  }

  async find(id: string): Promise<User | null> {
    return await this.userModel.findByPk(id, { raw: true });
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll({ raw: true });
  }

  async create(attrs: Partial<User>): Promise<User> {
    return await this.userModel.create(attrs, { raw: true });
  }

  async update(attrs: Partial<User>): Promise<void> {
    if (!attrs.id) {
      throw new Error('no id specified');
    }
    return await this.userModel.update(attrs, { where: { id: attrs.id } });
  }

  async destroyAll(): Promise<void> {
    await this.userModel.destroy({ where: {}, truncate: true });
  }
}
