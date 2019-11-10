import { getUser } from './query/getUser';
import { getUsers } from './query/getUsers';
import { IResolvers } from 'apollo-server';
import { login } from './mutation/login';
import { notations } from './user/notations';
import { logout } from './mutation/logout';
import { reauth } from './mutation/reauth';
import { signup } from './mutation/signup';

export const getResolvers = (): IResolvers => ({
  // Scalars

  // Types
  User: {
    notations,
  },
  // Query
  Query: {
    getUsers,
    getUser,
  },
  // Mutation
  Mutation: {
    login,
    logout,
    signup,
    reauth,
  },
});
