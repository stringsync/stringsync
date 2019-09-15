import books from './books';
import addBook from './addBook';
import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: {
    books,
  },
  Mutation: {
    addBook,
  },
};

export default resolvers;
