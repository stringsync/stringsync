import { IFieldResolver } from 'apollo-server';
import { Context } from 'src';
import { Book } from '../type-defs/Book';

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

interface Args {}

const books: IFieldResolver<any, Context, Args> = () => {
  return allBooks;
};

export default books;
