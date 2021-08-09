import { EntityManager } from '@mikro-orm/core';
import Dataloader from 'dataloader';
import { inject, injectable } from 'inversify';
import { Db, UserEntity } from '../../db';
import { User } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { alignOneToOne, ensureNoErrors } from '../../util';
import { UserLoader as IUserLoader } from '../types';
import { em } from './em';
import { pojo } from './pojo';

@injectable()
export class UserLoader implements IUserLoader {
  em: EntityManager;

  byIdLoader: Dataloader<string, User | null>;

  constructor(@inject(TYPES.Db) public db: Db) {
    this.em = em(db);

    this.byIdLoader = new Dataloader(this.loadAllById);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.byIdLoader.load(id);
    this.byIdLoader.clearAll();
    return ensureNoErrors(user);
  }

  private loadAllById = async (ids: readonly string[]): Promise<Array<User | null>> => {
    const _ids = [...ids];

    const users = await this.em.find(UserEntity, { id: { $in: _ids } });

    return alignOneToOne(_ids, pojo(users), {
      getKey: (user) => user.id,
      getUniqueIdentifier: (user) => user.id,
      getMissingValue: () => null,
    });
  };
}
