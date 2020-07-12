import { TestGraphqlClient, gql } from '../../../testing';
import { Query, Mutation, LoginInput, SignupInput } from '../../../testing/graphqlTypes';

export class TestAuthClient {
  graphqlClient: TestGraphqlClient;

  constructor(graphqlClient: TestGraphqlClient) {
    this.graphqlClient = graphqlClient;
  }

  async whoami() {
    return await this.graphqlClient.call<Query['whoami'], 'whoami'>(gql`
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
    return await this.graphqlClient.call<Mutation['login'], 'login', { input: LoginInput }>(
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

  async signup(input: SignupInput) {
    return await this.graphqlClient.call<Mutation['signup'], 'signup', { input: SignupInput }>(
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

  async logout() {
    return await this.graphqlClient.call<Mutation['logout'], 'logout'>(
      gql`
        mutation {
          logout
        }
      `
    );
  }
}
