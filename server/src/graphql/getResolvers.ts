import { IFieldResolver } from 'graphql-tools';
import { AuthRequirements, compose } from '../common';
import { withAuthRequirement, Middleware } from './middlewares';
import {
  user,
  users,
  confirmEmail,
  login,
  logout,
  resendConfirmationEmail,
  signup,
} from './resolvers';
import { ResolverCtx } from '../util/ctx';

const combine = <R extends IFieldResolver<any, ResolverCtx, any>>(
  resolver: R,
  ...middlewares: Middleware[]
): R => compose(...middlewares)(resolver);

// prettier-ignore

export const getResolvers = () => ({
  Query: {
    user: combine(
      user,
      withAuthRequirement(AuthRequirements.NONE)
    ),
    users: combine(
      users,
      withAuthRequirement(AuthRequirements.LOGGED_IN_AS_ADMIN)
    ),
  },
  Mutation: {
    signup: combine(
      signup,
      withAuthRequirement(AuthRequirements.LOGGED_OUT)
    ),
    login: combine(
      login,
      withAuthRequirement(AuthRequirements.LOGGED_OUT)
    ),
    logout: combine(
      logout,
      withAuthRequirement(AuthRequirements.LOGGED_IN)
    ),
    confirmEmail: combine(
      confirmEmail,
      withAuthRequirement(AuthRequirements.LOGGED_IN)
    ),
    resendConfirmationEmail: combine(
      resendConfirmationEmail,
      withAuthRequirement(AuthRequirements.LOGGED_IN)
    ),
  },
});
