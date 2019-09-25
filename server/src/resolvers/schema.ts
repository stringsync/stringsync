import { makeExecutableSchema, gql, IResolvers } from 'apollo-server';
import { getUsers } from './query/getUsers';
import { getUser } from './query/getUser';
import { refreshAuth } from './query/refreshAuth';
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

export interface NotationType {
  id: number;
}

export interface GetUserInputType {
  id: number;
}

export interface RefreshAuthInputType {
  id: number;
}

export interface RefreshAuthPayloadType {
  jwt: string;
}

export interface SignupInputType {
  username: string;
  email: string;
  password: string;
}

export interface SignupPayloadType {
  jwt: string;
  user: UserType;
}

export interface LoginInputType {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayloadType {
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
    getUsers: [User]!
    getUser(input: GetUserInput!): User!
    refreshAuth(input: RefreshAuthInput!): RefreshAuthPayload!
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
    getUser,
    refreshAuth,
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
