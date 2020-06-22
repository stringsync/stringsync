import { Sequelize } from 'sequelize-typescript';
import { ContainerConfig } from '@stringsync/config';
import { ContainerModule } from 'inversify';
import { TYPES } from './constants';
import { connectToDb } from '@stringsync/sequelize';

export const getSequelizeModule = (config: ContainerConfig) =>
  new ContainerModule((bind) => {
    const sequelize = connectToDb(config);
    bind<Sequelize>(TYPES.Sequelize).toConstantValue(sequelize);
  });
