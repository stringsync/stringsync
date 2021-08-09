import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { inject, injectable } from 'inversify';
import { Config } from '../../config';
import { InternalError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { camelCaseKeys } from '../../repos/queries';
import { Logger } from '../../util';
import { Db as IDb, Orm, Task } from '../types';
import { ENTITIES_BY_TABLE_NAME } from './entities';
import options from './mikro-orm.config';

@injectable()
export class Db implements IDb {
  ormType = Orm.MikroORM;

  private _orm: MikroORM<PostgreSqlDriver> | undefined = undefined;
  private didInit = false;

  constructor(@inject(TYPES.Logger) private logger: Logger, @inject(TYPES.Config) private config: Config) {}

  async init() {
    if (this.didInit) {
      return;
    }
    this._orm = await MikroORM.init(options);
    this.didInit = true;
  }

  get orm(): MikroORM<PostgreSqlDriver> {
    if (typeof this._orm === 'undefined') {
      throw new InternalError('must call init before accessing the orm member');
    }
    return this._orm;
  }

  get em() {
    return this.orm.em;
  }

  async transaction(task: Task) {
    this.orm.em.transactional(async (em) => {
      await task({ type: Orm.MikroORM, em });
    });
  }

  async query<T = unknown>(sql: string): Promise<T[]> {
    const connection = this.orm.em.getConnection();
    const rows = await connection.execute(sql);
    return camelCaseKeys<T>(rows);
  }

  async checkHealth() {
    return await this.orm.isConnected();
  }

  async closeConnection() {
    await this.orm.close(true);
  }

  async cleanup() {
    const connection = this.orm.em.getConnection();
    const tableNames = Object.values(ENTITIES_BY_TABLE_NAME);

    await connection.execute(`TRUNCATE TABLE ${tableNames.join(', ')} RESTART IDENTITY`);

    this.orm.em.clear();
  }
}
