export interface Config {
  NODE_ENV: string;
  PORT: string;
  CLIENT_URI: string;
  DB_NAME: string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: string;
}

// valid means T[P] for all P
type MaybeValid<T> = { [P in keyof T]: T[P] | undefined };

const getMaybeValidConfig = (env: NodeJS.ProcessEnv): MaybeValid<Config> => ({
  NODE_ENV: env.NODE_ENV,
  PORT: env.PORT,
  CLIENT_URI: env.CLIENT_URI,
  DB_NAME: env.DB_NAME,
  DB_USERNAME: env.DB_USERNAME,
  DB_PASSWORD: env.DB_PASSWORD,
  DB_HOST: env.DB_HOST,
  DB_PORT: env.DB_PORT,
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
