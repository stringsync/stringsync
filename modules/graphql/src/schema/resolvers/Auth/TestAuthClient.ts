import { TestGraphqlClient, gql } from '../../../testing';
import { Query, Mutation, LoginInput, SignupInput, ConfirmEmailInput } from '../../../testing/graphqlTypes';
import { ReqPasswordResetInput } from './ReqPasswordResetInput';
import { ResetPasswordInput } from './ResetPasswordInput';

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

  async confirmEmail(input: ConfirmEmailInput) {
    return await this.graphqlClient.call<Mutation['confirmEmail'], 'confirmEmail', { input: ConfirmEmailInput }>(
      gql`
        mutation confirmEmail($input: ConfirmEmailInput!) {
          confirmEmail(input: $input) {
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

  async resendConfirmationEmail() {
    return await this.graphqlClient.call<Mutation['resendConfirmationEmail'], 'resendConfirmationEmail'>(
      gql`
        mutation {
          resendConfirmationEmail
        }
      `
    );
  }

  async sendResetPasswordEmail(input: ReqPasswordResetInput) {
    return await this.graphqlClient.call<
      Mutation['sendResetPasswordEmail'],
      'sendResetPasswordEmail',
      { input: ReqPasswordResetInput }
    >(
      gql`
        mutation sendResetPasswordEmail($input: ReqPasswordResetInput!) {
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
