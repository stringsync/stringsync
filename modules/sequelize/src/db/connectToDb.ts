import { Db } from './Db';
import { Sequelize } from 'sequelize';
import { defineModels } from '../models/defineModels';
import { createNamespace } from 'cls-hooked';
import { DbConfig } from './DbConfig';
import { transactionFactory } from './transactionFactory';

export const connectToDb = (config: DbConfig): Db => {
  const namespace = createNamespace(config.namespaceName);
  Sequelize.useCLS(namespace);

  const sequelize = new Sequelize({
    dialect: 'postgres',
    database: config.databaseName,
    username: config.username,
    password: config.password,
    host: config.host,
    port: config.port,
  });

  const models = defineModels(sequelize);

  const transaction = transactionFactory(sequelize, config.namespaceName, namespace);

  return {
    Sequelize,
    sequelize,
    transaction,
    ...models,
  };
};
