import { IResolvers } from 'apollo-server';
import { getUser, getUsers } from './query';
import { login, logout, signup, authenticate, confirmEmail } from './mutation';
import { notations } from './user';

export const getResolvers = (): IResolvers => ({
  User: {
    notations,
  },
  Query: {
    getUsers,
    getUser,
  },
  Mutation: {
    login,
    logout,
    signup,
    authenticate,
    confirmEmail,
  },
});
