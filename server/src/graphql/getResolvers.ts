import {
  user,
  users,
  confirmEmail,
  login,
  logout,
  resendConfirmationEmail,
  signup,
} from './resolvers';

export const getResolvers = () => ({
  Query: {
    user,
    users,
  },
  Mutation: {
    signup,
    login,
    logout,
    confirmEmail,
    resendConfirmationEmail,
  },
});
