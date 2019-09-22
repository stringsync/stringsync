import { gql } from 'apollo-server';

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export interface UserInput {
  username: string;
  email: string;
  password: string;
}

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    createdAt: Date!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
`;
