import { IResolvers } from 'apollo-server';
import { getUsersResolver, getUserResolver } from './query';
import {
  loginResolver,
  logoutResolver,
  signupResolver,
  reauthResolver,
} from './mutation';
import { notationsResolver } from './user';

export const getResolvers = (): IResolvers => ({
  User: {
    notations: notationsResolver,
  },
  Query: {
    getUsers: getUsersResolver,
    getUser: getUserResolver,
  },
  Mutation: {
    login: loginResolver,
    logout: logoutResolver,
    signup: signupResolver,
    reauth: reauthResolver,
  },
});
