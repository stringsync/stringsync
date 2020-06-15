import { WebConfig, getWebConfig } from '@stringsync/config';
import { GraphqlClient, AuthClient } from '@stringsync/clients';
import { Container } from 'inversify';
import { TYPES } from './constants';

export const createWebContainer = (config: WebConfig = getWebConfig()) => {
  const container = new Container();

  container.bind<GraphqlClient>(TYPES.GraphqlClient).to(GraphqlClient);
  container.bind<AuthClient>(TYPES.AuthClient).to(AuthClient);

  return container;
};
