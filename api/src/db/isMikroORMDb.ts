import { Db as MikroORMDb } from './mikro-orm';
import { Db, Orm } from './types';

export const isMikroORMDb = (db: Db): db is MikroORMDb => db.ormType === Orm.MikroORM;
