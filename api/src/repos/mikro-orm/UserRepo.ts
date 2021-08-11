import { EntityManager, QueryOrder } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { get } from 'lodash';
import { Db } from '../../db';
import { UserEntity } from '../../db/mikro-orm';
import { User } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { Connection, Pager, PagingCtx, PagingType, UserConnectionArgs } from '../../util';
import { findUserPageMaxQuery, findUserPageMinQuery } from '../queries';
import { UserLoader, UserRepo as IUserRepo } from '../types';
import { getEntityManager, pojo } from './helpers';

@injectable()
export class UserRepo implements IUserRepo {
  static pager = new Pager<User>(20, 'user');

  em: EntityManager;

  constructor(@inject(TYPES.UserLoader) public userLoader: UserLoader, @inject(TYPES.Db) public db: Db) {
    this.em = getEntityManager(db);
  }

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const username = usernameOrEmail;
    const email = usernameOrEmail;
    const user = await this.em.findOne(UserEntity, { $or: [{ username }, { email }] });
    return user ? pojo(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.em.findOne(UserEntity, { email });
    return user ? pojo(user) : null;
  }

  async findByResetPasswordToken(resetPasswordToken: string): Promise<User | null> {
    const user = await this.em.findOne(UserEntity, { resetPasswordToken });
    return user ? pojo(user) : null;
  }

  async count(): Promise<number> {
    return await this.em.count(UserEntity);
  }

  async validate(user: User): Promise<void> {
    await new UserEntity(user).validate();
  }

  async find(id: string): Promise<User | null> {
    return await this.userLoader.findById(id);
  }

  async findAll(): Promise<User[]> {
    const users = await this.em.find(UserEntity, {}, { orderBy: { cursor: QueryOrder.DESC } });
    return pojo(users);
  }

  async create(attrs: Partial<User>): Promise<User> {
    const user = this.em.create(UserEntity, attrs);
    this.em.persist(user);
    await this.em.flush();
    return pojo(user);
  }

  async bulkCreate(bulkAttrs: Partial<User>[]): Promise<User[]> {
    const users = bulkAttrs.map((attrs) => new UserEntity(attrs));
    this.em.persist(users);
    await this.em.flush();
    return pojo(users);
  }

  async update(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.em.findOne(UserEntity, { id });
    if (!user) {
      throw new NotFoundError('user not found');
    }
    this.em.assign(user, attrs);
    this.em.persist(user);
    await this.em.flush();
    return pojo(user);
  }

  async findPage(args: UserConnectionArgs): Promise<Connection<User>> {
    return await UserRepo.pager.connect(args, async (pagingCtx: PagingCtx) => {
      const { cursor, limit, pagingType } = pagingCtx;

      const [entities, minRows, maxRows] = await Promise.all([
        this.em.find(
          UserEntity,
          { cursor: { [pagingType === PagingType.FORWARD ? '$gt' : '$lt']: cursor } },
          { orderBy: { cursor: pagingType === PagingType.FORWARD ? QueryOrder.ASC : QueryOrder.DESC }, limit }
        ),
        this.db.query<number>(findUserPageMinQuery()),
        this.db.query<number>(findUserPageMaxQuery()),
      ]);

      if (pagingType === PagingType.BACKWARD) {
        entities.reverse();
      }

      const min = get(minRows, '[0].min') || -Infinity;
      const max = get(maxRows, '[0].max') || +Infinity;

      return { entities: pojo(entities), min, max };
    });
  }
}
