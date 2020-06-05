import { Db } from './types';
import { Sequelize } from 'sequelize';
import { defineModels } from '../models/defineModels';
import { TRANSACTION_NAMESPACE } from './constants';
import { transactionFactory } from './transactionFactory';
import { ContainerConfig } from '@stringsync/config';

export const connectToDb = (config: ContainerConfig): Db => {
  Sequelize.useCLS(TRANSACTION_NAMESPACE);

  const sequelize = new Sequelize({
    dialect: 'postgres',
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: config.DB_PORT,
  });

  const models = defineModels(sequelize);

  const transaction = transactionFactory(sequelize);

  return {
    Sequelize,
    sequelize,
    transaction,
    ...models,
  };
};
