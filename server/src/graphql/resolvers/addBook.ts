import { allBooks } from './books';
import { IFieldResolver } from 'apollo-server';
import { BookInput, Book } from '../type-defs/Book';

interface Args {
  input: BookInput;
}

const addBook: IFieldResolver<any, any, Args> = (parent, args) => {
  const book: Book = { ...args.input };
  allBooks.push(book);
  return book;
};

export default addBook;
