import { IResolvers } from 'apollo-server';
import users from './users';
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
