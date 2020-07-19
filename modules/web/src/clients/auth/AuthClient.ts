import { GraphqlClient } from '../graphql';
import { gql } from '../gql';
import { Query, Mutation } from '../graphqlTypes';
import {
  LoginInput,
  SignupInput,
  ConfirmEmailInput,
  SendResetPasswordEmailInput,
  ResetPasswordInput,
} from '../graphqlTypes';

export class AuthClient {
  graphqlClient: GraphqlClient;

  constructor(graphqlClient: GraphqlClient) {
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

  async logout() {
    return await this.graphqlClient.call<Mutation['logout'], 'logout'>(gql`
      mutation logout {
        logout
      }
    `);
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

  async confirmEmail(input: ConfirmEmailInput) {
    return await this.graphqlClient.call<Mutation['confirmEmail'], 'confirmEmail', { input: ConfirmEmailInput }>(
      gql`
        mutation confirmEmail($input: ConfirmEmailInput!) {
          confirmEmail(input: $input) {
            confirmedAt
          }
        }
      `,
      { input }
    );
  }

  async resendConfirmationEmail() {
    return await this.graphqlClient.call<Mutation['resendConfirmationEmail'], 'resendConfirmationEmail'>(gql`
      mutation {
        resendConfirmationEmail
      }
    `);
  }

  async sendResetPasswordEmail(input: SendResetPasswordEmailInput) {
    return await this.graphqlClient.call<
      Mutation['sendResetPasswordEmail'],
      'sendResetPasswordEmail',
      { input: SendResetPasswordEmailInput }
    >(
      gql`
        mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
          sendResetPasswordEmail(input: $input)
        }
      `,
      { input }
    );
  }

  async resetPassword(input: ResetPasswordInput) {
    return await this.graphqlClient.call<Mutation['resetPassword'], 'resetPassword', { input: ResetPasswordInput }>(
      gql`
        mutation resetPassword($input: ResetPasswordInput!) {
          resetPassword(input: $input)
        }
      `,
      { input }
    );
  }
}
