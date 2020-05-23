import { Sequelize } from 'sequelize';
import { defineModels } from './models';
import { Db } from './types';
import { Config } from '../../config';
import { Logger } from 'winston';
import { createNamespace } from 'cls-hooked';

export const connectToDb = (config: Config, logger: Logger): Db => {
  const namespace = createNamespace('transaction');
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

  return {
    namespace,
    sequelize,
    Sequelize,
    ...models,
  };
};
