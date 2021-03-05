// import { gql, TestGraphqlClient } from '../../../testing';
// import {
//   ConfirmEmailInput,
//   LoginInput,
//   Mutation,
//   Query,
//   ResetPasswordInput,
//   SendResetPasswordEmailInput,
//   SignupInput,
// } from '../../../testing/graphqlTypes';

// export class TestAuthClient {
//   graphqlClient: TestGraphqlClient;

//   constructor(graphqlClient: TestGraphqlClient) {
//     this.graphqlClient = graphqlClient;
//   }

//   async whoami() {
//     return await this.graphqlClient.call<Query, 'whoami'>(gql`
//       query {
//         whoami {
//           id
//           email
//           username
//           role
//           confirmedAt
//         }
//       }
//     `);
//   }

//   async login(input: LoginInput) {
//     return await this.graphqlClient.call<Mutation, 'login', { input: LoginInput }>(
//       gql`
//         mutation login($input: LoginInput!) {
//           login(input: $input) {
//             id
//             email
//             username
//             role
//             confirmedAt
//           }
//         }
//       `,
//       { input }
//     );
//   }

//   async signup(input: SignupInput) {
//     return await this.graphqlClient.call<Mutation, 'signup', { input: SignupInput }>(
//       gql`
//         mutation signup($input: SignupInput!) {
//           signup(input: $input) {
//             id
//             email
//             username
//             role
//             confirmedAt
//           }
//         }
//       `,
//       { input }
//     );
//   }

//   async logout() {
//     return await this.graphqlClient.call<Mutation, 'logout'>(
//       gql`
//         mutation {
//           logout
//         }
//       `
//     );
//   }

//   async confirmEmail(input: ConfirmEmailInput) {
//     return await this.graphqlClient.call<Mutation, 'confirmEmail', { input: ConfirmEmailInput }>(
//       gql`
//         mutation confirmEmail($input: ConfirmEmailInput!) {
//           confirmEmail(input: $input) {
//             id
//             email
//             username
//             role
//             confirmedAt
//           }
//         }
//       `,
//       { input }
//     );
//   }

//   async resendConfirmationEmail() {
//     return await this.graphqlClient.call<Mutation, 'resendConfirmationEmail'>(
//       gql`
//         mutation {
//           resendConfirmationEmail
//         }
//       `
//     );
//   }

//   async sendResetPasswordEmail(input: SendResetPasswordEmailInput) {
//     return await this.graphqlClient.call<Mutation, 'sendResetPasswordEmail', { input: SendResetPasswordEmailInput }>(
//       gql`
//         mutation sendResetPasswordEmail($input: SendResetPasswordEmailInput!) {
//           sendResetPasswordEmail(input: $input)
//         }
//       `,
//       { input }
//     );
//   }

//   async resetPassword(input: ResetPasswordInput) {
//     return await this.graphqlClient.call<Mutation, 'resetPassword', { input: ResetPasswordInput }>(
//       gql`
//         mutation resetPassword($input: ResetPasswordInput!) {
//           resetPassword(input: $input)
//         }
//       `,
//       { input }
//     );
//   }
// }
