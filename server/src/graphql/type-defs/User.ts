import { gql } from 'apollo-server';

export type UserProvider = 'email';

export interface User {
  uid: string;
  provider: UserProvider;
  username: string;
  email: string;
}

export default gql`
  type User {
    uid: String!
    provider: String!
    username: String!
    email: String!
  }
`;
