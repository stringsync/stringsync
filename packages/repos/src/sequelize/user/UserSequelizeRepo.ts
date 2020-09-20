import { Base64, Connection, ConnectionArgs, NotFoundError, PagingType } from '@stringsync/common';
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

  static decodeRankCursor(cursor: string): number {
    const [cursorType, rank] = Base64.decode(cursor).split(UserSequelizeRepo.CURSOR_DELIMITER);
    if (cursorType !== UserSequelizeRepo.CURSOR_TYPE) {
      throw new Error(`expected cursor type '${UserSequelizeRepo.CURSOR_TYPE}', got: ${cursorType}`);
    }
    try {
      return parseInt(rank, 10);
    } catch (e) {
      throw new Error(`cannot decode cursor: ${cursor}`);
    }
  }

  static encodeRankCursor(rank: number): string {
    const cursorType = UserSequelizeRepo.CURSOR_TYPE;
    const cursorDelimiter = UserSequelizeRepo.CURSOR_DELIMITER;
    return Base64.encode(`${cursorType}${cursorDelimiter}${rank}`);
  }

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
    return await UserModel.findAll({ order: [['rank', 'DESC']], raw: true });
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
    const pagingMeta = Pager.meta(connectionArgs);

    switch (pagingMeta.pagingType) {
      case PagingType.FORWARD:
        const first = pagingMeta.first || UserSequelizeRepo.PAGE_LIMIT;
        const after = pagingMeta.after;
        return await this.pageForward(first, after);

      case PagingType.BACKWARD:
        const last = pagingMeta.last || UserSequelizeRepo.PAGE_LIMIT;
        const before = pagingMeta.before;
        return await this.pageBackward(last, before);

      default:
        throw new Error(`operation not supported`);
    }
  }

  private async pageNone(limit: number): Promise<Connection<User>> {
    const [users, count] = await Promise.all([
      UserModel.findAll({
        order: [['rank', 'DESC']],
        limit,
        raw: true,
      }),
      this.count(),
    ]);
    const edges = users.map((user) => ({
      node: user,
      cursor: UserSequelizeRepo.encodeRankCursor(user.rank),
    }));

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? first(edges)!.cursor : null,
        endCursor: edges.length ? last(edges)!.cursor : null,
        hasNextPage: edges.length < count,
        hasPreviousPage: false,
      },
    };
  }

  private async pageForward(limit: number, after: string | null): Promise<Connection<User>> {
    const [users, min, max] = await Promise.all([
      UserModel.findAll({
        where: typeof after === 'string' ? { rank: { [Op.lt]: UserSequelizeRepo.decodeRankCursor(after) } } : undefined,
        order: [['rank', 'DESC']],
        limit,
        raw: true,
      }),
      UserModel.min<number, UserModel>('rank'),
      UserModel.max<number, UserModel>('rank'),
    ]);
    const edges = users.map((user) => ({
      cursor: UserSequelizeRepo.encodeRankCursor(user.rank),
      node: user,
    }));
    const ranks = edges.map((edge) => edge.node.rank);

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? first(edges)!.cursor : null,
        endCursor: edges.length ? last(edges)!.cursor : null,
        hasNextPage: Math.min(...ranks) > min,
        hasPreviousPage: Math.max(...ranks) < max,
      },
    };
  }

  private async pageBackward(last: number, before: string | null): Promise<Connection<User>> {
    throw new Error('not implemented');
  }
}
