import { IResolvers } from 'apollo-server';

// Query
import books from './books';
import users from './users';

// Mutation
import addBook from './addBook';
import signup from './signup';

const resolvers: IResolvers = {
  Query: {
    books,
    users,
  },
  Mutation: {
    addBook,
    signup,
  },
};

export default resolvers;
