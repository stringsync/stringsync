import { gql } from 'apollo-server';

export default gql`
  type Query {
    users: [User]
  }
`;
