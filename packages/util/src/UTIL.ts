import { CDN_DOMAIN_NAME, configFactory, LOG_LEVEL, NODE_ENV, REDIS_HOST, REDIS_PORT } from '@stringsync/config';
import { Pkg } from '@stringsync/di';
import { BlobStorage, NoopStorage, S3Storage } from './blob-storage';
import { Cache, RedisCache } from './cache';
import { Logger, WinstonLogger } from './logger';
import { Mailer, Nodemailer, NoopMailer } from './mailer';
import { MessageQueue, NoopMessageQueue, SqsMessageQueue } from './message-queue';

export const UTIL_CONFIG = configFactory({
  NODE_ENV: NODE_ENV,
  LOG_LEVEL: LOG_LEVEL,
  REDIS_HOST: REDIS_HOST,
  REDIS_PORT: REDIS_PORT,
  CDN_DOMAIN_NAME: CDN_DOMAIN_NAME,
});

export type UtilConfig = ReturnType<typeof UTIL_CONFIG>;

export const TYPES = {
  UtilConfig: Symbol('UtilConfig'),
  Logger: Symbol('Logger'),
  Cache: Symbol('Cache'),
  BlobStorage: Symbol('BlobStorage'),
  Mailer: Symbol('Mailer'),
  MessageQueue: Symbol('MessageQueue'),
};

export const UTIL: Pkg<typeof TYPES> = {
  name: 'UTIL',
  TYPES,
  deps: [],
  bindings: async (bind) => {
    const config = UTIL_CONFIG();
    bind<UtilConfig>(TYPES.UtilConfig).toConstantValue(config);

    bind<Logger>(TYPES.Logger)
      .to(WinstonLogger)
      .inSingletonScope();
    bind<Cache>(TYPES.Cache)
      .to(RedisCache)
      .inSingletonScope();

    if (config.NODE_ENV === 'test') {
      bind<BlobStorage>(TYPES.BlobStorage).to(NoopStorage);
    } else {
      bind<BlobStorage>(TYPES.BlobStorage).to(S3Storage);
    }

    if (config.NODE_ENV === 'test') {
      bind<Mailer>(TYPES.Mailer).to(NoopMailer);
    } else {
      bind<Mailer>(TYPES.Mailer).to(Nodemailer);
    }

    if (config.NODE_ENV === 'test') {
      bind<MessageQueue>(TYPES.MessageQueue).to(NoopMessageQueue);
    } else {
      bind<MessageQueue>(TYPES.MessageQueue).to(SqsMessageQueue);
    }
  },
};
