import { gql } from 'apollo-server';

export default gql`
  type Mutation {
    signup(input: UserInput!): User!
    addBook(input: BookInput!): Book!
  }
`;
