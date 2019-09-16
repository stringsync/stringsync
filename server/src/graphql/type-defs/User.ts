import { gql } from 'apollo-server';

export default gql`
  type User {
    uid: String!
    provider: String!
    username: String!
    email: String!
  }
`;
