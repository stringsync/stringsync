import { gql } from 'apollo-server';

export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
}

export default gql`
  type User {
    id: Int!
    username: String!
    email: String!
    createdAt: Date!
  }
`;
