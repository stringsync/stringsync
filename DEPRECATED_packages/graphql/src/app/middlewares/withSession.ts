import { ContainerConfig } from '@stringsync/config';
import { TYPES } from '@stringsync/di';
import connectRedis from 'connect-redis';
import { Handler } from 'express';
import session from 'express-session';
import { Container } from 'inversify';
import { RedisClient as Redis } from 'redis';
import * as uuid from 'uuid';

const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export const withSession = (container: Container): Handler => {
  const config = container.get<ContainerConfig>(TYPES.ContainerConfig);
  const redis = container.get<Redis>(TYPES.Redis);

  const RedisStore = connectRedis(session);
  const store = new RedisStore({ client: redis });
  const isProduction = config.NODE_ENV === 'production';
  const secure = isProduction;
  const sameSite = isProduction ? 'none' : undefined;

  return session({
    secret: config.APP_SESSION_SECRET,
    cookie: { httpOnly: true, maxAge: MAX_AGE_MS, secure, sameSite },
    genid: () => uuid.v4(),
    proxy: undefined,
    resave: false,
    rolling: false,
    saveUninitialized: false,
    store,
  }) as Handler;
};