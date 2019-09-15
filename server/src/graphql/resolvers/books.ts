import { IResolvers } from 'graphql-tools';

export interface Book {
  title: string;
  author: string;
}

export const allBooks: Book[] = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const books = () => allBooks;

export default books;
