import { GraphqlClient } from './GraphqlClient';

export class AuthClient {
  public readonly graphql: GraphqlClient;

  constructor(graphql: GraphqlClient) {
    this.graphql = graphql;
  }
}
