import { InternalError } from './errors';

export type Config = {
  NODE_ENV: string;
};

const isConfig = (config: Record<string, unknown>): config is Config => {
  if (typeof config.NODE_ENV !== 'string') {
    return false;
  }
  return true;
};

export const getConfig = (env: NodeJS.ProcessEnv): Config => {
  const config = {
    NODE_ENV: env.NODE_ENV,
    REACT_APP_SERVER_URI: env.REACT_APP_SERVER_URI,
    REACT_APP_GRAPHQL_ENDPOINT: env.REACT_APP_GRAPHQL_ENDPOINT,
  };
  if (!isConfig(config)) {
    throw new InternalError(`invalid config: ${JSON.stringify(config, null, 2)}`);
  }
  return config;
};
