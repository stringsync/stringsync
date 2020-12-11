import { Pkg } from '@stringsync/di';
import { BlobStorage, NoopStorage, S3Storage } from './blob-storage';
import { Cache, RedisCache } from './cache';
import { Logger, WinstonLogger } from './logger';
import { Mailer, Nodemailer, NoopMailer } from './mailer';
import { MessageQueue, NoopMessageQueue, SqsMessageQueue } from './message-queue';
import { UtilConfig, UTIL_CONFIG } from './UTIL_CONFIG';
import { UTIL_TYPES } from './UTIL_TYPES';

export const UTIL: Pkg = {
  name: 'UTIL',
  deps: [],
  bindings: async (bind) => {
    const config = UTIL_CONFIG();
    bind<UtilConfig>(UTIL_TYPES.UtilConfig).toConstantValue(config);

    bind<Logger>(UTIL_TYPES.Logger)
      .to(WinstonLogger)
      .inSingletonScope();
    bind<Cache>(UTIL_TYPES.Cache)
      .to(RedisCache)
      .inSingletonScope();

    if (config.NODE_ENV === 'test') {
      bind<BlobStorage>(UTIL_TYPES.BlobStorage).to(NoopStorage);
    } else {
      bind<BlobStorage>(UTIL_TYPES.BlobStorage).to(S3Storage);
    }

    if (config.NODE_ENV === 'test') {
      bind<Mailer>(UTIL_TYPES.Mailer).to(NoopMailer);
    } else {
      bind<Mailer>(UTIL_TYPES.Mailer).to(Nodemailer);
    }

    if (config.NODE_ENV === 'test') {
      bind<MessageQueue>(UTIL_TYPES.MessageQueue).to(NoopMessageQueue);
    } else {
      bind<MessageQueue>(UTIL_TYPES.MessageQueue).to(SqsMessageQueue);
    }
  },
};
