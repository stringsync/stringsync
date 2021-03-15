import { getConfig } from '../config';

export const getGraphqlUri = (env = process.env) => {
  const config = getConfig(env);
  return config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT;
};
