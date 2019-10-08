import { makeExecutableSchema, gql } from 'apollo-server';
import { resolvers } from '.';

const typeDefs = gql`
  # Scalar
  scalar Date

  # Types/Inputs
  type User {
    id: Int!
    username: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
    notations: [Notation]
  }

  type Notation {
    id: Int!
  }

  input GetUserInput {
    id: Int!
  }

  type ReauthPayload {
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
    ok: Boolean!
  }

  # Query
  type Query {
    getUsers: [User]!
    getUser(input: GetUserInput!): User!
  }

  # Mutation
  type Mutation {
    signup(input: SignupInput!): SignupPayload!
    login(input: LoginInput!): LoginPayload!
    logout: LogoutPayload!
    reauth: ReauthPayload!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
