import { configFactory, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME, NODE_ENV } from '@stringsync/config';
import { Pkg } from '@stringsync/di';
import { UTIL } from '@stringsync/util';
import { SequelizeDb } from './sequelize';
import { Database } from './types';

export const DB_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  DB_HOST: DB_HOST,
  DB_NAME: DB_NAME,
  DB_PASSWORD: DB_PASSWORD,
  DB_PORT: DB_PORT,
  DB_USERNAME: DB_USERNAME,
});

export type DbConfig = ReturnType<typeof DB_CONFIG>;

export const TYPES = {
  Database: Symbol('Database'),
  DbConfig: Symbol('DbConfig'),
};

export const DB: Pkg<typeof TYPES> = {
  name: 'DB',
  TYPES,
  deps: [UTIL],
  bindings: async (bind) => {
    const config = DB_CONFIG();
    bind<DbConfig>(TYPES.DbConfig).toConstantValue(config);

    bind<Database>(TYPES.Database)
      .to(SequelizeDb)
      .inSingletonScope();
  },
};
