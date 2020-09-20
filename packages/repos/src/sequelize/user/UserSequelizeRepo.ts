import { Base64, Connection, ConnectionArgs, NotFoundError, NotImplementedError, PagingType } from '@stringsync/common';
import { Pager } from '../../util';
import { UserLoader } from '../../types';
import { TYPES } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { UserModel } from '@stringsync/db';
import { inject, injectable } from 'inversify';
import { Op } from 'sequelize';
import { UserRepo } from '../../types';
import { last, first } from 'lodash';

@injectable()
export class UserSequelizeRepo implements UserRepo {
  static CURSOR_TYPE = 'user';
  static CURSOR_DELIMITER = ':';
  static PAGE_LIMIT = 50;

  userLoader: UserLoader;

  constructor(@inject(TYPES.UserLoader) userLoader: UserLoader) {
    this.userLoader = userLoader;
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const username = usernameOrEmail;
    const email = usernameOrEmail;
    return await UserModel.findOne({
      where: { [Op.or]: [{ username }, { email }] } as any,
      raw: true,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({
      where: { email },
      raw: true,
    });
  }

  async findByResetPasswordToken(resetPasswordToken: string): Promise<User | null> {
    return await UserModel.findOne({
      where: { resetPasswordToken },
      raw: true,
    });
  }

  async count(): Promise<number> {
    return await UserModel.count();
  }

  async find(id: string): Promise<User | null> {
    return await this.userLoader.findById(id);
  }

  async findAll(): Promise<User[]> {
    return await UserModel.findAll({ order: [['cursor', 'DESC']], raw: true });
  }

  async create(attrs: Partial<User>): Promise<User> {
    const userModel = await UserModel.create(attrs, { raw: true });
    const user = userModel.get({ plain: true }) as User;
    return user;
  }

  async bulkCreate(bulkAttrs: Partial<User>[]): Promise<User[]> {
    const userModels: UserModel[] = await UserModel.bulkCreate(bulkAttrs);
    const users = userModels.map((userModel: UserModel) => userModel.get({ plain: true })) as User[];
    return users;
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const userEntity = await UserModel.findByPk(id);
    if (!userEntity) {
      throw new NotFoundError('user missing');
    }
    await userEntity.update(attrs);
    return userEntity.get({ plain: true });
  }

  async findPage(connectionArgs: ConnectionArgs): Promise<Connection<User>> {
    throw new NotImplementedError();
  }
}
