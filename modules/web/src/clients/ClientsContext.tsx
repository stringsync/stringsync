import React, { useMemo } from 'react';
import { AuthClient } from './auth';
import { GraphqlClient } from './graphql';
import { getWebConfig } from '@stringsync/config';

type Clients = ReturnType<typeof getClients>;

type Props = {
  clients?: Partial<Clients>;
};

const getClients = () => {
  const config = getWebConfig(process.env);

  const graphqlClient = new GraphqlClient(config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT);
  const authClient = new AuthClient(graphqlClient);

  return {
    graphqlClient,
    authClient,
  };
};

export const ClientsContext = React.createContext(getClients());

export const ClientsProvider: React.FC<Props> = (props) => {
  const clients = useMemo(() => ({ ...getClients(), ...props.clients }), [props.clients]);
  return <ClientsContext.Provider value={clients}>{props.children}</ClientsContext.Provider>;
};
