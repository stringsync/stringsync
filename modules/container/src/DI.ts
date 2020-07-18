import { ContainerConfig, getContainerConfig } from '@stringsync/config';
import { Db } from '@stringsync/sequelize';
import { Container as InversifyContainer } from 'inversify';
import { RedisClient } from 'redis';
import { Sequelize } from 'sequelize-typescript';
import * as winston from 'winston';
import { TYPES } from './constants';
import { getGraphqlModule } from './getGraphqlModule';
import { getLoggerModule } from './getLoggerModule';
import { getRedisModule } from './getRedisModule';
import { getReposModule } from './getReposModule';
import { getSequelizeModule } from './getSequelizeModule';
import { getServicesModule } from './getServicesModule';
import { Redis } from './redis';

export class DI {
  static create(config: ContainerConfig = getContainerConfig()) {
    const container = new InversifyContainer();
    const logger = winston.createLogger({
      level: config.LOG_LEVEL,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
      ],
    });

    container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

    const redisModule = getRedisModule(config);
    const servicesModule = getServicesModule(config);
    const reposModule = getReposModule(config);
    const graphqlModule = getGraphqlModule(config);
    const sequelizeModule = getSequelizeModule(config, logger);
    const loggerModule = getLoggerModule(config, logger);

    container.load(redisModule, servicesModule, reposModule, graphqlModule, sequelizeModule, loggerModule);

    return container;
  }

  static async cleanup(container: InversifyContainer) {
    const redis = container.get<RedisClient>(TYPES.Redis);
    const sequelize = container.get<Sequelize>(TYPES.Sequelize);

    const redisCleanupPromise = Redis.cleanup(redis);
    const dbCleanupPromise = Db.cleanup(sequelize);

    await Promise.all([redisCleanupPromise, dbCleanupPromise]);
  }

  static async teardown(container: InversifyContainer) {
    const redis = container.get<RedisClient>(TYPES.Redis);
    const sequelize = container.get<Sequelize>(TYPES.Sequelize);

    const redisTeardownPromise = Redis.teardown(redis);
    const dbTeardownPromise = Db.teardown(sequelize);

    await Promise.all([redisTeardownPromise, dbTeardownPromise]);
  }
}
