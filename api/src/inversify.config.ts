import { Container } from 'inversify';
import 'reflect-metadata';
import { Config, getConfig } from './config';
import { Db, SequelizeDb } from './db';
import { TYPES } from './inversify.constants';
import {
  NotationLoader,
  NotationRepo,
  SequelizeNotationLoader,
  SequelizeNotationRepo,
  SequelizeTaggingRepo,
  SequelizeTagLoader,
  SequelizeTagRepo,
  SequelizeUserLoader,
  SequelizeUserRepo,
  TaggingRepo,
  TagLoader,
  TagRepo,
  UserLoader,
  UserRepo,
} from './repos';
import {
  AuthService,
  HealthCheckerService,
  NotationService,
  NotificationService,
  TaggingService,
  TagService,
  UserService,
  VideoUrlService,
} from './services';
import {
  BlobStorage,
  Cache,
  DevMailer,
  Logger,
  Mailer,
  MessageQueue,
  Nodemailer,
  NoopMailer,
  NoopMessageQueue,
  NoopStorage,
  RedisCache,
  S3Storage,
  SqsMessageQueue,
  WinstonLogger,
} from './util';

export const container = new Container();

const config = getConfig();

container
  .bind<Db>(TYPES.Db)
  .to(SequelizeDb)
  .inSingletonScope();
container.bind<Logger>(TYPES.Logger).to(WinstonLogger);
container.bind<Config>(TYPES.Config).toConstantValue(getConfig());

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<HealthCheckerService>(TYPES.HealthCheckerService).to(HealthCheckerService);
container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
container.bind<NotationService>(TYPES.NotationService).to(NotationService);
container.bind<TagService>(TYPES.TagService).to(TagService);
container.bind<TaggingService>(TYPES.TaggingService).to(TaggingService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<VideoUrlService>(TYPES.VideoUrlService).to(VideoUrlService);

container.bind<TagLoader>(TYPES.TagLoader).to(SequelizeTagLoader);
container.bind<TagRepo>(TYPES.TagRepo).to(SequelizeTagRepo);
container.bind<UserRepo>(TYPES.UserRepo).to(SequelizeUserRepo);
container.bind<UserLoader>(TYPES.UserLoader).to(SequelizeUserLoader);
container.bind<NotationRepo>(TYPES.NotationRepo).to(SequelizeNotationRepo);
container.bind<NotationLoader>(TYPES.NotationLoader).to(SequelizeNotationLoader);
container.bind<TaggingRepo>(TYPES.TaggingRepo).to(SequelizeTaggingRepo);

container.bind<Cache>(TYPES.Cache).to(RedisCache);

if (config.NODE_ENV === 'test') {
  container.bind<MessageQueue>(TYPES.MessageQueue).to(NoopMessageQueue);
} else {
  container.bind<MessageQueue>(TYPES.MessageQueue).to(SqsMessageQueue);
}

if (config.NODE_ENV === 'test') {
  container.bind<BlobStorage>(TYPES.BlobStorage).to(NoopStorage);
} else {
  container.bind<BlobStorage>(TYPES.BlobStorage).to(S3Storage);
}

if (config.NODE_ENV === 'test') {
  container.bind<Mailer>(TYPES.Mailer).to(NoopMailer);
} else if (config.NODE_ENV === 'development') {
  container.bind<Mailer>(TYPES.Mailer).to(DevMailer);
} else {
  container.bind<Mailer>(TYPES.Mailer).to(Nodemailer);
}
