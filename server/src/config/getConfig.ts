import { Config } from './types';

const getMaybeValidConfig = (env: NodeJS.ProcessEnv): Partial<Config> => ({
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  WEB_URI: env.WEB_URI,
  DB_NAME: env.DB_NAME,
  DB_USERNAME: env.DB_USERNAME,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_HOST: env.DB_HOST,
  DB_PORT: env.DB_PORT,
  REDIS_HOST: env.REDIS_HOST,
  REDIS_PORT: env.REDIS_PORT,
  ROLE: env.ROLE,
  SESSION_SECRET: env.SESSION_SECRET,
});

export const getConfig = (env: NodeJS.ProcessEnv): Config => {
  const config = getMaybeValidConfig(env);

  for (const [key, val] of Object.entries(config)) {
    if (!val) {
      throw new Error(`expected ${key} to be defined: ${val}`);
    }
  }

  return config as Config;
};
