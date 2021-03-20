import { getConfig } from '../config';

export const getGraphqlUri = (env = process.env) => {
  const config = getConfig(env);

  const hostname =
    config.NODE_ENV === 'development' ? `http://${window.location.hostname}:3000` : config.REACT_APP_SERVER_URI;
  return hostname + config.REACT_APP_GRAPHQL_ENDPOINT;
};
