import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './typeDefs';
import {
  user,
  users,
  confirmEmail,
  login,
  resendConfirmationEmail,
  signup,
} from './resolvers';

export const getSchema = () =>
  makeExecutableSchema({
    typeDefs,
    resolvers: {
      Query: {
        user,
        users,
      },
      Mutation: {
        confirmEmail,
        login,
        resendConfirmationEmail,
        signup,
      },
    },
    allowUndefinedInResolve: false,
    resolverValidationOptions: {
      requireResolversForArgs: true,
      requireResolversForNonScalar: false,
      requireResolversForAllFields: false,
      allowResolversNotInSchema: false,
    },
  });
