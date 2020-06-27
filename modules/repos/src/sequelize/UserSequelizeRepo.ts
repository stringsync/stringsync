import { TYPES } from '@stringsync/container';
import { User } from '@stringsync/domain';
import { UserModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { or } from 'sequelize';
import { UserRepo } from './../types';

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
    const userModel = await this.userModel.create(attrs, { raw: true });
    return userModel.get({ plain: true }) as User;
  }

  async bulkCreate(bulkAttrs: Partial<User>[]): Promise<User[]> {
    const userModels: UserModel[] = await this.userModel.bulkCreate(bulkAttrs);
    return userModels.map((userModel: UserModel) => userModel.get({ plain: true })) as User[];
  }

  async update(id: string, attrs: Partial<User>): Promise<void> {
    await this.userModel.update(attrs, { where: { id } });
  }
}
