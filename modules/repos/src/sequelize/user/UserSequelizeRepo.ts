import { UserLoader } from './../../types';
import { TYPES } from '@stringsync/container';
import { User } from '@stringsync/domain';
import { UserModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { or } from 'sequelize';
import { UserRepo } from '../../types';

@injectable()
export class UserSequelizeRepo implements UserRepo {
  userModel: typeof UserModel;
  userLoader: UserLoader;

  constructor(@inject(TYPES.UserModel) userModel: typeof UserModel, @inject(TYPES.UserLoader) userLoader: UserLoader) {
    this.userModel = userModel;
    this.userLoader = userLoader;
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
    return await this.userLoader.findById(id);
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.findAll({ raw: true });
  }

  async create(attrs: Partial<User>): Promise<User> {
    const userModel = await this.userModel.create(attrs, { raw: true });
    const user = userModel.get({ plain: true }) as User;
    return user;
  }

  async bulkCreate(bulkAttrs: Partial<User>[]): Promise<User[]> {
    const userModels: UserModel[] = await this.userModel.bulkCreate(bulkAttrs);
    const users = userModels.map((userModel: UserModel) => userModel.get({ plain: true })) as User[];
    return users;
  }

  async update(id: string, attrs: Partial<User>): Promise<void> {
    await this.userModel.update(attrs, { where: { id } });
  }
}
