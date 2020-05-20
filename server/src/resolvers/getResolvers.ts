import { users } from './users';
import { user } from './user';
import { signup } from './signup';
import { login } from './login';
import { logout } from './logout';
import { authenticate } from './authenticate';
import { confirmEmail } from './confirmEmail';
import { resendConfirmationEmail } from './resendConfirmationEmail';

export const getResolvers = () => ({
  Query: {
    users,
    user,
  },
  Mutation: {
    signup,
    login,
    logout,
    authenticate,
    confirmEmail,
    resendConfirmationEmail,
  },
});
