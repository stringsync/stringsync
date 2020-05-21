import {
  user,
  users,
  confirmEmail,
  login,
  logout,
  resendConfirmationEmail,
  signup,
  me,
} from './resolvers';

export const getResolvers = () => ({
  Query: {
    user,
    users,
    me,
  },
  Mutation: {
    signup,
    login,
    logout,
    confirmEmail,
    resendConfirmationEmail,
  },
});
