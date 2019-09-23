import { IResolvers } from 'apollo-server';
import users from './users';
import signup from './signup';
import login from './login';

const resolvers: IResolvers = {
  Query: {
    users,
  },
  Mutation: {
    signup,
    login,
  },
};

export default resolvers;
