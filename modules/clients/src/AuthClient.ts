import { GraphqlClient } from './GraphqlClient';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';

@injectable()
export class AuthClient {
  public readonly graphql: GraphqlClient;

  constructor(@inject(TYPES.GraphqlClient) graphql: GraphqlClient) {
    this.graphql = graphql;
  }
}
