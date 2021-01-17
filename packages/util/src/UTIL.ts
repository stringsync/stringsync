import { Pkg } from '@stringsync/di';
import { BlobStorage, NoopStorage, S3Storage } from './blob-storage';
import { Cache, RedisCache } from './cache';
import { Logger, WinstonLogger } from './logger';
import { Mailer, Nodemailer, NoopMailer } from './mailer';
import { MessageQueue, NoopMessageQueue, SqsMessageQueue } from './message-queue';
import { UtilConfig, UTIL_CONFIG } from './UTIL_CONFIG';
import { UTIL_TYPES } from './UTIL_TYPES';

const TYPES = { ...UTIL_TYPES };

export const UTIL: Pkg = {
  name: 'UTIL',
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
  cleanup: async (container) => {
    const cache = container.get<Cache>(TYPES.Cache);
    await cache.cleanup();
  },
  teardown: async (container) => {
    const cache = container.get<Cache>(TYPES.Cache);
    await cache.teardown();
  },
};
