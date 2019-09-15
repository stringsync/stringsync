import { Book, allBooks } from './books';
import { IFieldResolver } from 'graphql-tools';

interface Args {
  title: string;
  author: string;
}

const addBook: IFieldResolver<any, any, Args> = (parent, args) => {
  const { title, author } = args;
  const book: Book = { title, author };
  allBooks.push(book);
  return book;
};

export default addBook;
