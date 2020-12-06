import { containerFactory, SyncMod, TYPES } from '@stringsync/di';
import { SERVICES } from '@stringsync/services';
import { DbConfig, DB_CONFIG } from './config';
import { SequelizeDb } from './sequelize';
import { Db } from './types';

export const API = new SyncMod((bind) => {
  const config = DB_CONFIG();
  bind<DbConfig>(TYPES.DbConfig).toConstantValue(config);

  bind<Db>(TYPES.Db)
    .to(SequelizeDb)
    .inSingletonScope();
});

export const createContainer = containerFactory(API, SERVICES);
