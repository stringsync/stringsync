import { AuthClient } from './auth/AuthClient';
import { GraphqlClient } from './graphql/GraphqlClient';
import { getWebConfig } from '@stringsync/config';
import { Clients } from './types';

export const createClients = (): Clients => {
  const config = getWebConfig(process.env);
  const uri = config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT;

  const graphqlClient = new GraphqlClient(uri);
  const authClient = new AuthClient(graphqlClient);

  return {
    graphqlClient,
    authClient,
  };
};
