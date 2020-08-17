import { Pager } from '@stringsync/repos';
import { ContainerConfig, getContainerConfig } from '@stringsync/config';
import { AuthResolver, HealthController, NotationResolver, TagResolver, UserResolver } from '@stringsync/graphql';
import {
  NotationLoader,
  NotationRepo,
  NotationSequelizeLoader,
  NotationSequelizeRepo,
  TaggingRepo,
  TaggingSequelizeRepo,
  TagLoader,
  TagRepo,
  TagSequelizeLoader,
  TagSequelizeRepo,
  UserLoader,
  UserRepo,
  UserSequelizeLoader,
  UserSequelizeRepo,
  NotationSequelizePager,
} from '@stringsync/repos';
import { Db, NotationModel, TaggingModel, TagModel, UserModel } from '@stringsync/sequelize';
import {
  AuthService,
  HealthCheckerService,
  NotationService,
  NotificationService,
  TagService,
  UserService,
} from '@stringsync/services';
import { Container as InversifyContainer, ContainerModule } from 'inversify';
import nodemailer from 'nodemailer';
import { RedisClient } from 'redis';
import { Sequelize } from 'sequelize-typescript';
import * as winston from 'winston';
import { TYPES } from './constants';
import { Logger } from './logger';
import { Mailer, NodemailerMailer } from './mailer';
import { Redis } from './redis';
import { Notation } from '@stringsync/domain';
import { Ctor } from '@stringsync/common';

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

    container.load(
      DI.getConfigModule(config),
      DI.getMailerModule(config),
      DI.getGraphqlModule(config),
      DI.getRedisModule(config),
      DI.getServicesModule(config),
      DI.getReposModule(config),
      DI.getSequelizeModule(config, logger),
      DI.getLoggerModule(config, logger)
    );

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

  private static getConfigModule(config: ContainerConfig) {
    return new ContainerModule((bind) => {
      bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);
    });
  }

  private static getMailerModule(config: ContainerConfig) {
    let mailer: Mailer;
    if (config.NODE_ENV === 'test') {
      mailer = { send: jest.fn() };
    } else {
      const transporter = nodemailer.createTransport({});
      mailer = new NodemailerMailer(transporter);
    }
    return new ContainerModule((bind) => {
      bind<Mailer>(TYPES.Mailer).toConstantValue(mailer);
    });
  }

  private static getGraphqlModule(config: ContainerConfig) {
    return new ContainerModule((bind) => {
      bind<UserResolver>(UserResolver)
        .toSelf()
        .inSingletonScope();
      bind<TagResolver>(TagResolver)
        .toSelf()
        .inSingletonScope();
      bind<NotationResolver>(NotationResolver)
        .toSelf()
        .inSingletonScope();

      bind<AuthResolver>(AuthResolver).toSelf();

      bind<HealthController>(TYPES.HealthController).to(HealthController);
    });
  }

  private static getRedisModule(config: ContainerConfig) {
    return new ContainerModule((bind) => {
      const redis = Redis.create({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      });
      bind<RedisClient>(TYPES.Redis).toConstantValue(redis);
    });
  }

  private static getServicesModule(config: ContainerConfig) {
    return new ContainerModule(async (bind) => {
      bind<HealthCheckerService>(TYPES.HealthCheckerService).to(HealthCheckerService);
      bind<AuthService>(TYPES.AuthService).to(AuthService);
      bind<NotificationService>(TYPES.NotificationService).to(NotificationService);

      bind<UserService>(TYPES.UserService)
        .to(UserService)
        .inRequestScope();
      bind<NotationService>(TYPES.NotationService)
        .to(NotationService)
        .inRequestScope();
      bind<TagService>(TYPES.TagService)
        .to(TagService)
        .inRequestScope();
    });
  }

  private static getReposModule(config: ContainerConfig) {
    return new ContainerModule((bind) => {
      bind<UserLoader>(TYPES.UserLoader).to(UserSequelizeLoader);
      bind<Ctor<UserLoader>>(TYPES.UserLoaderCtor).toConstructor(UserSequelizeLoader);
      bind<UserRepo>(TYPES.UserRepo).to(UserSequelizeRepo);

      bind<NotationLoader>(TYPES.NotationLoader).to(NotationSequelizeLoader);
      bind<Ctor<NotationLoader>>(TYPES.NotationLoaderCtor).toConstructor(NotationSequelizeLoader);
      bind<NotationRepo>(TYPES.NotationRepo).to(NotationSequelizeRepo);
      bind<Pager<Notation>>(TYPES.NotationPager).to(NotationSequelizePager);

      bind<TagLoader>(TYPES.TagLoader).to(TagSequelizeLoader);
      bind<Ctor<TagLoader>>(TYPES.TagLoaderCtor).toConstructor(TagSequelizeLoader);
      bind<TagRepo>(TYPES.TagRepo).to(TagSequelizeRepo);

      bind<TaggingRepo>(TYPES.TaggingRepo).to(TaggingSequelizeRepo);

      if (config.NODE_ENV === 'test') {
        bind<UserSequelizeLoader>(TYPES.UserSequelizeLoader).to(UserSequelizeLoader);
        bind<UserSequelizeRepo>(TYPES.UserSequelizeRepo).to(UserSequelizeRepo);

        bind<NotationSequelizeLoader>(TYPES.NotationSequelizeLoader).to(NotationSequelizeLoader);
        bind<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo).to(NotationSequelizeRepo);

        bind<TagSequelizeLoader>(TYPES.TagSequelizeLoader).to(TagSequelizeLoader);
        bind<TagSequelizeRepo>(TYPES.TagSequelizeRepo).to(TagSequelizeRepo);

        bind<TaggingSequelizeRepo>(TYPES.TaggingSequelizeRepo).to(TaggingSequelizeRepo);
      }
    });
  }

  private static getSequelizeModule(config: ContainerConfig, logger: Logger) {
    return new ContainerModule((bind) => {
      const sequelize = Db.connect({
        database: config.DB_NAME,
        host: config.DB_HOST,
        port: config.DB_PORT,
        password: config.DB_PASSWORD,
        username: config.DB_USERNAME,
        logging: logger.debug,
      });
      bind<Sequelize>(TYPES.Sequelize).toConstantValue(sequelize);
      bind<typeof UserModel>(TYPES.UserModel).toConstructor(UserModel);
      bind<typeof NotationModel>(TYPES.NotationModel).toConstructor(NotationModel);
      bind<typeof TagModel>(TYPES.TagModel).toConstructor(TagModel);
      bind<typeof TaggingModel>(TYPES.TaggingModel).toConstructor(TaggingModel);
    });
  }

  private static getLoggerModule(config: ContainerConfig, logger: Logger) {
    return new ContainerModule((bind) => {
      bind<Logger>(TYPES.Logger).toConstantValue(logger);
    });
  }
}
