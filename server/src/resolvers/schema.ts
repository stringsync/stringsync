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

  input RefreshAuthInput {
    id: Int!
  }

  type RefreshAuthPayload {
    jwt: String!
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  type SignupPayload {
    jwt: String!
    user: User!
  }

  input LoginInput {
    emailOrUsername: String!
    password: String!
  }

  type LoginPayload {
    jwt: String!
    user: User!
  }

  # Query
  type Query {
    login(input: LoginInput!): LoginPayload!
    refreshAuth(input: RefreshAuthInput!): RefreshAuthPayload!
    getUsers: [User]!
    getUser(input: GetUserInput!): User!
  }

  # Mutation
  type Mutation {
    signup(input: SignupInput!): SignupPayload!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
