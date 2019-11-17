import { IResolvers } from 'apollo-server';
import { resolveGetUser, resolveGetUsers } from './query';
import {
  resolveLogin,
  resolveLogout,
  resolveSignup,
  resolveReauth,
} from './mutation';
import { resolveNotations } from './user';

export const getResolvers = (): IResolvers => ({
  User: {
    notations: resolveNotations,
  },
  Query: {
    getUsers: resolveGetUsers,
    getUser: resolveGetUser,
  },
  Mutation: {
    login: resolveLogin,
    logout: resolveLogout,
    signup: resolveSignup,
    reauth: resolveReauth,
  },
});
