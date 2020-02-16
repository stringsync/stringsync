import { gql } from 'apollo-server';

export const typeDefs = gql`
  # Scalar
  scalar Date

  enum UserRoles {
    student
    teacher
    admin
  }

  # Types/Inputs
  type User {
    id: String!
    username: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    notations: [Notation]
    role: UserRoles!
  }

  type Notation {
    id: String!
  }

  input GetUserInput {
    id: String!
  }

  type AuthenticatePayload {
    xsrfToken: String!
    user: User!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  type SignupPayload {
    user: User!
  }

  input LoginInput {
    emailOrUsername: String!
    password: String!
  }

  type LoginPayload {
    user: User!
  }

  type LogoutPayload {
    user: User!
  }

  input ConfirmEmailInput {
    confirmationToken: String!
  }

  type ConfirmEmailPayload {
    id: String!
  }

  # Query
  type Query {
    getUsers: [User]!
    getUser(input: GetUserInput!): User
    getCsrfToken: String!
  }

  # Mutation
  type Mutation {
    signup(input: SignupInput!): SignupPayload!
    login(input: LoginInput!): LoginPayload!
    logout: LogoutPayload!
    authenticate: AuthenticatePayload!
    confirmEmail(input: ConfirmEmailInput!): ConfirmEmailPayload!
  }
`;
