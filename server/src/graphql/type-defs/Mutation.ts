import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    addBook(input: BookInput!): Book!
  }
`;
