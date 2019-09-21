import { gql } from 'apollo-server';
import { UserProvider } from '../../models/User';

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
