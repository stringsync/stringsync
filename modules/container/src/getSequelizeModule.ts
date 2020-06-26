import { Sequelize } from 'sequelize-typescript';
import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from './constants';
import { Db } from '@stringsync/sequelize';

export const getSequelizeModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const sequelize = Db.connect({
      database: config.DB_NAME,
      host: config.DB_HOST,
      port: config.DB_PORT,
      password: config.DB_PASSWORD,
      username: config.DB_USERNAME,
    });
    bind<Sequelize>(TYPES.Sequelize).toConstantValue(sequelize);
  });
