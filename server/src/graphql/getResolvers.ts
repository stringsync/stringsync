import {
  user,
  users,
  confirmEmail,
  login,
  logout,
  resendConfirmationEmail,
  signup,
  whoami,
} from './resolvers';

export const getResolvers = () => ({
  Query: {
    user,
    users,
    whoami,
  },
  Mutation: {
    signup,
    login,
    logout,
    confirmEmail,
    resendConfirmationEmail,
  },
});
