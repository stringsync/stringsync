import { GraphqlClient } from '../graphql';
import { Query, Mutation, LoginInput } from '../graphqlTypes';
import { gql } from '../gql';
import { getWebConfig } from '@stringsync/config';

export class AuthClient {
  readonly graphql: GraphqlClient;

  static create(): AuthClient {
    const config = getWebConfig(process.env);
    const graphql = new GraphqlClient(config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT);
    return new AuthClient(graphql);
  }

  constructor(graphql: GraphqlClient) {
    this.graphql = graphql;
  }

  async whoami() {
    return this.graphql.call<Query['whoami'], 'whoami'>(gql`
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

  async login(input: LoginInput) {
    return this.graphql.call<Mutation['login'], 'login', { input: LoginInput }>(
      gql`
        mutation login($input: LoginInput!) {
          login(input: $input) {
            id
            email
            username
            role
            confirmedAt
          }
        }
      `,
      { input }
    );
  }

  async logout() {
    return this.graphql.call<Mutation['logout'], 'logout'>(gql`
      mutation logout {
        logout
      }
    `);
  }
}
