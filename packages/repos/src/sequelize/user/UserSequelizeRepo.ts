import { Connection, NotFoundError, NotImplementedError, PagingType, UserConnectionArgs } from '@stringsync/common';
import { UserModel } from '@stringsync/db';
import { TYPES } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { inject, injectable } from 'inversify';
import { get } from 'lodash';
import { Op } from 'sequelize';
import { camelCaseKeys } from '../../queries';
import { UserLoader, UserRepo } from '../../types';
import { Pager, PagingCtx } from '../../util';

@injectable()
export class UserSequelizeRepo implements UserRepo {
  static pager = new Pager<User>(20, 'user');

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

  async findPage(args: UserConnectionArgs): Promise<Connection<User>> {
    return await UserSequelizeRepo.pager.connect(args, async (pagingCtx: PagingCtx) => {
      const { cursor, limit, pagingType } = pagingCtx;

      const cmp = pagingType === PagingType.FORWARD ? Op.gt : Op.lt;

      const [entities, min, max] = await Promise.all([
        UserModel.findAll({
          where: {
            cursor: {
              [cmp]: cursor,
            },
          },
          limit,
          raw: true,
        }),
        UserModel.min<number, UserModel>('cursor'),
        UserModel.max<number, UserModel>('cursor'),
      ]);

      if (pagingType === PagingType.BACKWARD) {
        entities.reverse();
      }

      return { entities, min, max };
    });
  }
}