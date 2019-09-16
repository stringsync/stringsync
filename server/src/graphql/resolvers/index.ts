import { IResolvers } from 'apollo-server';

// Query
import books from './books';
import users from './users';

// Mutation
import addBook from './addBook';

const resolvers: IResolvers = {
  Query: {
    books,
    users,
  },
  Mutation: {
    addBook,
  },
};

export default resolvers;
