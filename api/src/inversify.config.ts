import { Container } from 'inversify';
import { createClient, RedisClient } from 'redis';
import 'reflect-metadata';
import { Config, config } from './config';
import { Db } from './db';
import { Db as MikroORMDb } from './db/mikro-orm';
import { TYPES } from './inversify.constants';
import { AssociateVideoUrl, PulseCheck, SendMail } from './jobs';
import { NotationLoader, NotationRepo, TaggingRepo, TagLoader, TagRepo, UserLoader, UserRepo } from './repos';
import {
  NotationLoader as MikroORMNotationLoader,
  NotationRepo as MikroORMNotationRepo,
  TaggingRepo as MikroORMTaggingRepo,
  TagLoader as MikroORMTagLoader,
  TagRepo as MikroORMTagRepo,
  UserLoader as MikroORMUserLoader,
  UserRepo as MikroORMUserRepo,
} from './repos/mikro-orm';
import { AuthResolver, ExperimentResolver, NotationResolver, TagResolver, UserResolver } from './resolvers';
import { ApiServer, DevApiServer, GraphqlServer, JobServer } from './server';
import { WorkerServer } from './server/worker';
import {
  AuthService,
  HealthCheckerService,
  MailWriterService,
  NotationService,
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

container.bind<Config>(TYPES.Config).toConstantValue(config);

if (config.NODE_ENV === 'production') {
  container
    .bind<Db>(TYPES.Db)
    .to(MikroORMDb)
    .inSingletonScope();
} else {
  container
    .bind<Db>(TYPES.Db)
    .to(MikroORMDb)
    .inSingletonScope();
}

const redis = createClient({ host: config.REDIS_HOST, port: config.REDIS_PORT });
container.bind<RedisClient>(TYPES.Redis).toConstantValue(redis);

container
  .bind<Cache>(TYPES.Cache)
  .to(RedisCache)
  .inSingletonScope();

container.bind<Logger>(TYPES.Logger).to(WinstonLogger);

container.bind<AuthService>(TYPES.AuthService).to(AuthService);
container.bind<HealthCheckerService>(TYPES.HealthCheckerService).to(HealthCheckerService);
container.bind<MailWriterService>(TYPES.MailWriterService).to(MailWriterService);
container.bind<NotationService>(TYPES.NotationService).to(NotationService);
container.bind<TagService>(TYPES.TagService).to(TagService);
container.bind<TaggingService>(TYPES.TaggingService).to(TaggingService);
container.bind<UserService>(TYPES.UserService).to(UserService);
container.bind<VideoUrlService>(TYPES.VideoUrlService).to(VideoUrlService);

container.bind<TagLoader>(TYPES.TagLoader).to(MikroORMTagLoader);
container.bind<TagRepo>(TYPES.TagRepo).to(MikroORMTagRepo);
container.bind<UserRepo>(TYPES.UserRepo).to(MikroORMUserRepo);
container.bind<UserLoader>(TYPES.UserLoader).to(MikroORMUserLoader);
container.bind<NotationRepo>(TYPES.NotationRepo).to(MikroORMNotationRepo);
container.bind<NotationLoader>(TYPES.NotationLoader).to(MikroORMNotationLoader);
container.bind<TaggingRepo>(TYPES.TaggingRepo).to(MikroORMTaggingRepo);

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
  container
    .bind<Mailer>(TYPES.Mailer)
    .to(NoopMailer)
    .inSingletonScope();
} else if (config.NODE_ENV === 'development') {
  container.bind<Mailer>(TYPES.Mailer).to(DevMailer);
} else {
  container.bind<Mailer>(TYPES.Mailer).to(Nodemailer);
}

if (config.NODE_ENV === 'development') {
  container.bind<GraphqlServer>(TYPES.ApiServer).to(DevApiServer);
} else {
  container.bind<GraphqlServer>(TYPES.ApiServer).to(ApiServer);
}
container.bind<JobServer>(TYPES.WorkerServer).to(WorkerServer);

container
  .bind<ExperimentResolver>(ExperimentResolver)
  .toSelf()
  .inSingletonScope();
container
  .bind<NotationResolver>(NotationResolver)
  .toSelf()
  .inSingletonScope();
container
  .bind<UserResolver>(UserResolver)
  .toSelf()
  .inSingletonScope();
container
  .bind<AuthResolver>(AuthResolver)
  .toSelf()
  .inSingletonScope();
container
  .bind<TagResolver>(TagResolver)
  .toSelf()
  .inSingletonScope();

container
  .bind<AssociateVideoUrl>(TYPES.AssociateVideoUrl)
  .to(AssociateVideoUrl)
  .inSingletonScope();
container
  .bind<PulseCheck>(TYPES.PulseCheck)
  .to(PulseCheck)
  .inSingletonScope();
container
  .bind<SendMail>(TYPES.SendMail)
  .to(SendMail)
  .inSingletonScope();
