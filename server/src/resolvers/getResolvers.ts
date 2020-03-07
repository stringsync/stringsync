import { IResolvers } from 'apollo-server';
import { getUser, getUsers } from './query';
import { notations } from './user';
import {
  login,
  logout,
  signup,
  authenticate,
  confirmEmail,
  resendConfirmation,
} from './mutation';

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
    resendConfirmation,
  },
});
