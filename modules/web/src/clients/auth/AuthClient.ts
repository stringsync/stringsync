import { GraphqlClient } from '../graphql';
import { Query } from '../graphqlTypes';
import { gql } from '../gql';

export class AuthClient {
  public readonly graphql: GraphqlClient;

  constructor(graphql: GraphqlClient) {
    this.graphql = graphql;
  }

  async whoami(): Promise<Query['whoami']> {
    return this.graphql.call(gql`
      query {
        whoami {
          id
          email
          username
          role
          confirmedAt
        }
      }
    `);
  }
}
