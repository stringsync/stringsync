import { Sequelize } from 'sequelize';
import { defineModels } from './models';
import { Db } from './types';
import { Config } from '../../config';
import { Logger } from 'winston';
import { Namespace } from 'cls-hooked';
import { transactionFactory } from './transactionFactory';

export const connectToDb = (
  config: Config,
  namespace: Namespace,
  logger: Logger
): Db => {
  Sequelize.useCLS(namespace);

  const sequelize = new Sequelize({
    dialect: 'postgres',
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    host: config.DB_HOST,
    port: parseInt(config.DB_PORT, 10),
    logging: (msg: string) => logger.debug(msg),
  });

  const models = defineModels(sequelize);

  const transaction = transactionFactory(sequelize, namespace);

  return {
    transaction,
    sequelize,
    Sequelize,
    ...models,
  };
};
