import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    addBook(title: String!, author: String!): Book!
  }
`;
