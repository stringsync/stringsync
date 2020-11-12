import { Ctor, noop } from '@stringsync/common';
import { ContainerConfig, getContainerConfig } from '@stringsync/config';
import { getJobConfig, JobConfig } from '@stringsync/config/src/getJobConfig';
import { Db, Sequelize, SequelizeDb } from '@stringsync/db';
import { AuthResolver, HealthController, NotationResolver, TagResolver, UserResolver } from '@stringsync/graphql';
import {
  Factory,
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
} from '@stringsync/repos';
import {
  AuthService,
  HealthCheckerService,
  NotationService,
  NotificationService,
  TaggingService,
  TagService,
  UserService,
} from '@stringsync/services';
import {
  Cache,
  FileStorage,
  Logger,
  Mailer,
  MessageQueue,
  NodemailerMailer,
  NoopMailer,
  NoopStorage,
  Redis,
  RedisCache,
  S3Storage,
  SqsMessageQueue,
  WinstonLogger,
} from '@stringsync/util';
import { Container as InversifyContainer, ContainerModule } from 'inversify';
import { TYPES } from './TYPES';

export class DI {
  static create(config: ContainerConfig = getContainerConfig()) {
    const container = new InversifyContainer();
    const logger = WinstonLogger.create(config.LOG_LEVEL);

    container.load(
      DI.getConfigModule(config),
      DI.getDbModule(config, logger),
      DI.getGraphqlModule(config),
      DI.getReposModule(config),
      DI.getServicesModule(config),
      DI.getUtilModule(config, logger),
      DI.getJobsModule(config)
    );

    return container;
  }

  private static getConfigModule(config: ContainerConfig) {
    return new ContainerModule((bind) => {
      bind<ContainerConfig>(TYPES.ContainerConfig).toConstantValue(config);
      bind<JobConfig>(TYPES.JobConfig).toConstantValue(getJobConfig());
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

  private static getServicesModule(config: ContainerConfig) {
    return new ContainerModule((bind) => {
      bind<HealthCheckerService>(TYPES.HealthCheckerService).to(HealthCheckerService);
      bind<AuthService>(TYPES.AuthService).to(AuthService);
      bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
      bind<UserService>(TYPES.UserService).to(UserService);
      bind<NotationService>(TYPES.NotationService).to(NotationService);
      bind<TagService>(TYPES.TagService).to(TagService);
      bind<TaggingService>(TYPES.TaggingService).to(TaggingService);
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

  private static getDbModule(config: ContainerConfig, logger: Logger) {
    return new ContainerModule((bind) => {
      const db = SequelizeDb.create({
        env: config.NODE_ENV,
        database: config.DB_NAME,
        host: config.DB_HOST,
        password: config.DB_PASSWORD,
        port: config.DB_PORT,
        username: config.DB_USERNAME,
        logging: (msg: string) => logger.debug(msg),
      });
      bind<Sequelize>(TYPES.Sequelize).toConstantValue(db.sequelize);
      bind<Db>(TYPES.Db).toConstantValue(db);

      if (config.NODE_ENV === 'test') {
        bind<Factory>(TYPES.Factory).to(Factory);
      }
    });
  }

  private static getUtilModule(config: ContainerConfig, logger: Logger) {
    return new ContainerModule((bind) => {
      bind<Cache>(TYPES.Cache).to(RedisCache);
      bind<Logger>(TYPES.Logger).toConstantValue(logger);

      const redis = RedisCache.createRedisClient({
        host: config.REDIS_HOST,
        port: config.REDIS_PORT,
      });
      bind<Redis>(TYPES.Redis).toConstantValue(redis);

      if (config.NODE_ENV === 'test') {
        bind<FileStorage>(TYPES.FileStorage).to(NoopStorage);
      } else {
        bind<FileStorage>(TYPES.FileStorage).toConstantValue(
          S3Storage.create({
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
            bucket: config.S3_BUCKET,
            domainName: config.CLOUDFRONT_DOMAIN_NAME,
          })
        );
      }

      if (config.NODE_ENV === 'test') {
        bind<Mailer>(TYPES.Mailer).to(NoopMailer);
      } else {
        const transporter = NodemailerMailer.createTransporter();
        bind<Mailer>(TYPES.Mailer).toConstantValue(new NodemailerMailer(transporter));
      }

      bind<MessageQueue>(TYPES.MessageQueue).toConstantValue(
        SqsMessageQueue.create({
          accessKeyId: config.AWS_ACCESS_KEY_ID,
          secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
          region: config.AWS_REGION,
        })
      );
    });
  }

  private static getJobsModule(config: ContainerConfig) {
    return new ContainerModule(noop);
  }
}
