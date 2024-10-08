import connectRedis from 'connect-redis';
import { Handler } from 'express';
import session from 'express-session';
import { RedisClient } from 'redis';
import * as uuid from 'uuid';
import { Config } from '../../../config';

const MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export const withSession = (redis: RedisClient, config: Config): Handler => {
  const RedisStore = connectRedis(session);
  const store = new RedisStore({ client: redis, ttl: MAX_AGE_MS / 1000 });
  const isProduction = config.NODE_ENV === 'production';
  const secure = isProduction;
  const sameSite = isProduction ? 'strict' : undefined;

  return session({
    secret: config.SESSION_SECRET,
    cookie: { httpOnly: true, maxAge: MAX_AGE_MS, secure, sameSite },
    genid: () => uuid.v4(),
    proxy: undefined,
    resave: false,
    rolling: false,
    saveUninitialized: false,
    store,
  }) as Handler;
};
