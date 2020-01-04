import { Config } from './types';

const getMaybeValidConfig = (env: NodeJS.ProcessEnv): Partial<Config> => ({
  WEB_URI: env.WEB_URI,
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
