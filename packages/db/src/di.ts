import { SyncMod, TYPES } from '@stringsync/di';
import { DbConfig, DB_CONFIG } from './config';
import { SequelizeDb } from './sequelize';
import { Db } from './types';

export const DB = new SyncMod((bind) => {
  const config = DB_CONFIG();
  bind<DbConfig>(TYPES.DbConfig).toConstantValue(config);

  bind<Db>(TYPES.Db)
    .to(SequelizeDb)
    .inSingletonScope();
});
