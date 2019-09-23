import { gql } from 'apollo-server';

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  jwt?: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  emailOrUsername: string;
  password: string;
}

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    createdAt: Date!
    jwt: String
  }

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    emailOrUsername: String!
    password: String!
  }
`;
