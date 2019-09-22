import { IResolvers } from 'apollo-server';

// Query
import users from './users';

// Mutation
import signup from './signup';

const resolvers: IResolvers = {
  Query: {
    users,
  },
  Mutation: {
    signup,
  },
};

export default resolvers;
