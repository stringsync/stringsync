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

const getMaybeValidConfig = (): MaybeValid<Config> => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  CLIENT_URI: process.env.CLIENT_URI,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

export const getConfig = (): Config => {
  const config = getMaybeValidConfig();

  for (const [key, val] of Object.entries(config)) {
    if (!val) {
      throw new Error(`expected ${key} to be defined: ${val}`);
    }
  }

  return config as Config;
};
