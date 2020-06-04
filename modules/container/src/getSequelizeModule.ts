import { ContainerModule } from 'inversify';
import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/container';
import { connectToDb, Db } from '@stringsync/sequelize';

export const getSequelizeModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const db = connectToDb({
      databaseName: config.DB_NAME,
      host: config.DB_HOST,
      password: config.DB_PASSWORD,
      username: config.DB_NAME,
      port: config.DB_PORT,
      namespaceName: 'transaction',
    });
    bind<Db>(TYPES.Db).toConstantValue(db);
  });
