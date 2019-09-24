import { makeExecutableSchema, gql, IResolvers } from 'apollo-server';
import { users } from './query/users';
import { login } from './mutation/login';
import { signup } from './mutation/signup';

export interface UserTypeDef {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SignupInputTypeDef {
  username: string;
  email: string;
  password: string;
}

export interface SignupPayloadTypeDef {
  jwt: string;
  user: UserTypeDef;
}

export interface LoginInputTypeDef {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayloadTypeDef {
  jwt: string;
  user: UserTypeDef;
}

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
    users: [User]
  }

  # Mutation
  type Mutation {
    signup(input: SignupInput!): SignupPayload!
    login(input: LoginInput!): LoginPayload!
  }
`;

const resolvers: IResolvers = {
  // Scalar

  // Types
  User: {},
  // Query
  Query: {
    users,
  },
  // Mutation
  Mutation: {
    login,
    signup,
  },
};

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
