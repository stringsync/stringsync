import { gql } from 'apollo-server';

export default gql`
  type Query {
    books: [Book]
  }
`;
