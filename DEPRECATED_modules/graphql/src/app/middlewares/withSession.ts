import session from 'express-session';
import * as uuid from 'uuid';
import connectRedis from 'connect-redis';
import { Handler } from 'express';
import { ContainerConfig } from '@stringsync/config';
import { Container, TYPES } from '@stringsync/container';
import { Redis } from 'ioredis';

const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export const withSession = (): Handler => {
  const config = Container.instance.get<ContainerConfig>(TYPES.ContainerConfig);
  const redis = Container.instance.get<Redis>(TYPES.Redis);

  const RedisStore = connectRedis(session);
  const store = new RedisStore({ client: redis });

  return session({
    secret: config.SESSION_SECRET,
    cookie: { httpOnly: true, sameSite: 'none', maxAge: MAX_AGE_MS },
    genid: () => uuid.v4(),
    proxy: undefined,
    resave: false,
    rolling: false,
    saveUninitialized: false,
    store,
  }) as Handler;
};
