import { ContainerModule } from 'inversify';
import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/container';
import { connectToDb, Db } from '@stringsync/sequelize';

export const getSequelizeModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const db = connectToDb(config);
    bind<Db>(TYPES.Db).toConstantValue(db);
  });
