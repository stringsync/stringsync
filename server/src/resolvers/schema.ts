import { makeExecutableSchema, gql, IResolvers } from 'apollo-server';
import { getUsers } from './query/getUsers';
import { login } from './mutation/login';
import { signup } from './mutation/signup';
import { notations } from './user/notations';

export interface UserType {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotationTypeDef {
  id: number;
}

export interface SignupInputTypeDef {
  username: string;
  email: string;
  password: string;
}

export interface SignupPayloadTypeDef {
  jwt: string;
  user: UserType;
}

export interface LoginInputTypeDef {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayloadTypeDef {
  jwt: string;
  user: UserType;
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
    notations: [Notation]
  }

  type Notation {
    id: Int!
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
    getUsers: [User]
  }

  # Mutation
  type Mutation {
    signup(input: SignupInput!): SignupPayload!
    login(input: LoginInput!): LoginPayload!
  }
`;

const resolvers: IResolvers = {
  // Scalars

  // Types
  User: {
    notations,
  },
  // Query
  Query: {
    getUsers,
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
