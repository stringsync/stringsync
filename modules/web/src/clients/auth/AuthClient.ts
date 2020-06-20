import { GraphqlClient } from '../graphql';
import { Query, Mutation, LoginInput, SignupInput } from '../graphqlTypes';
import { gql } from '../gql';
import { getWebConfig } from '@stringsync/config';

export class AuthClient {
  readonly graphqlClient: GraphqlClient;

  static create(): AuthClient {
    const config = getWebConfig(process.env);
    const graphqlClient = new GraphqlClient(config.REACT_APP_SERVER_URI + config.REACT_APP_GRAPHQL_ENDPOINT);
    return new AuthClient(graphqlClient);
  }

  constructor(graphqlClient: GraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async whoami() {
    return this.graphqlClient.call<Query['whoami'], 'whoami'>(gql`
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
    return this.graphqlClient.call<Mutation['login'], 'login', { input: LoginInput }>(
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
    return this.graphqlClient.call<Mutation['logout'], 'logout'>(gql`
      mutation logout {
        logout
      }
    `);
  }

  async signup(input: SignupInput) {
    return this.graphqlClient.call<Mutation['signup'], 'signup', { input: SignupInput }>(
      gql`
        mutation signup($input: SignupInput!) {
          signup(input: $input) {
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
}
