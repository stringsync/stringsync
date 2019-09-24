import { makeExecutableSchema, gql, IResolvers } from 'apollo-server';
import DateScalarType from './scalar/Date';
import users from './query/users';
import login from './mutation/login';
import signup from './mutation/signup';

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
  user: UserTypeDef;
  jwt: string;
}

export interface LoginInputTypeDef {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayloadTypeDef {
  user: UserTypeDef;
  jwt: string;
}

const typeDefs = gql`
  # Scalars
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
    user: User!
    jwt: String!
  }

  input LoginInput {
    emailOrUsername: String!
    password: String!
  }

  type LoginPayload {
    user: User!
    jwt: String!
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
  Date: DateScalarType,
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
