import { EntityManager, wrap } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Db, Orm } from '../../db';
import { BaseEntity, Db as MikroORMDb } from '../../db/mikro-orm';
import { InternalError } from '../../errors';

const isMikroORMDb = (db: Db): db is MikroORMDb => db.ormType === Orm.MikroORM;

export const forkEntityManager = (db: Db): EntityManager<PostgreSqlDriver> => {
  if (isMikroORMDb(db)) {
    return db.em.fork();
  }
  throw new InternalError(`Db is not MikroORMDb (${Orm.MikroORM}), got type: ${db.ormType}`);
};

export function pojo<T extends BaseEntity>(value: T): T;
export function pojo<T extends BaseEntity>(value: T[]): T[];
export function pojo<T extends BaseEntity>(value: T | T[]): T | T[] {
  if (Array.isArray(value)) {
    return value.map((v) => wrap(v).toObject()) as T[];
  } else {
    return wrap(value).toObject() as T;
  }
}
