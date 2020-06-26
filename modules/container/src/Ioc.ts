import { Sequelize } from 'sequelize-typescript';
import { TYPES } from './constants';
import { getContainerConfig, ContainerConfig } from '@stringsync/config';
import { Container as InversifyContainer } from 'inversify';
import { getSequelizeModule } from './getSequelizeModule';
import { getGraphqlModule } from './getGraphqlModule';
import { getReposModule } from './getReposModule';
import { getServicesModule } from './getServicesModule';
import { getRedisModule } from './getRedisModule';
import { RedisClient } from 'redis';
import { Db } from '@stringsync/sequelize';
import { Redis } from './redis';

export class Ioc {
  static create(config: ContainerConfig = getContainerConfig()) {
    const container = new InversifyContainer();

    container.bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);

    const redisModule = getRedisModule(config);
    const servicesModule = getServicesModule(config);
    const reposModule = getReposModule(config);
    const graphqlModule = getGraphqlModule(config);
    const sequelizeModule = getSequelizeModule(config);

    container.load(redisModule, servicesModule, reposModule, graphqlModule, sequelizeModule);

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
