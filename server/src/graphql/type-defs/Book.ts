import { gql } from 'apollo-server';

export interface Book {
  title: string;
  author: string;
}

export interface BookInput {
  title: string;
  author: string;
}

export default gql`
  type Book {
    title: String!
    author: String!
  }

  input BookInput {
    title: String!
    author: String!
  }
`;
