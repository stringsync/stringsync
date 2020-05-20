import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLScalarType,
  Kind,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLOutputType,
  GraphQLInt,
} from 'graphql';
import { GlobalCtx } from '../util/ctx';

/* eslint-disable prefer-const */
// We use `let` declarations at the beginning of the function so we
// can use thunks to reference the types independently of
// declaration order.

export const getSchema = () => {
  let dateType: GraphQLScalarType;
  let userRolesType: GraphQLEnumType;
  let userType: GraphQLObjectType;
  let notationType: GraphQLObjectType;
  let userInputType: GraphQLInputObjectType;
  let userOutputType: GraphQLObjectType;
  let usersInputType: GraphQLInputObjectType;
  let usersOutputType: GraphQLOutputType;
  let authenticateInputType: GraphQLInputObjectType;
  let authenticateOutputType: GraphQLOutputType;
  let signupInputType: GraphQLInputObjectType;
  let signupOutputType: GraphQLOutputType;
  let loginInputType: GraphQLInputObjectType;
  let loginOutputType: GraphQLOutputType;
  let logoutInputType: GraphQLInputObjectType;
  let logoutOutputType: GraphQLOutputType;
  let confirmEmailInputType: GraphQLInputObjectType;
  let confirmEmailOutputType: GraphQLOutputType;
  let resendConfirmationEmailInputType: GraphQLInputObjectType;
  let resendConfirmationEmailOutputType: GraphQLOutputType;
  let queryType: GraphQLObjectType;
  let mutationType: GraphQLObjectType;

  dateType = new GraphQLScalarType({
    name: 'Date',
    parseValue(value: string) {
      return new Date(value);
    },
    serialize(date: Date) {
      return date.getTime();
    },
    parseLiteral(ast) {
      return ast.kind === Kind.STRING ? new Date(ast.value) : null;
    },
  });

  userRolesType = new GraphQLEnumType({
    name: 'UserRoles',
    values: {
      STUDENT: { value: 'student' },
      TEACHER: { value: 'teacher' },
      ADMIN: { value: 'admin' },
    },
  });

  userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
      username: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      createdAt: { type: new GraphQLNonNull(dateType) },
      updatedAt: { type: new GraphQLNonNull(dateType) },
      confirmedAt: { type: dateType },
      notations: { type: new GraphQLList(GraphQLString) },
      role: { type: userRolesType },
    }),
  });

  notationType = new GraphQLObjectType({
    name: 'Notation',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLString) },
    }),
  });

  userInputType = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  userOutputType = userType;

  usersInputType = new GraphQLInputObjectType({
    name: 'UsersInput',
    fields: () => ({}),
  });

  usersOutputType = new GraphQLList(userType);

  authenticateInputType = new GraphQLInputObjectType({
    name: 'AuthenticateInput',
    fields: () => ({}),
  });

  authenticateOutputType = userType;

  signupInputType = new GraphQLInputObjectType({
    name: 'SignupInput',
    fields: () => ({
      username: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  signupOutputType = userType;

  loginInputType = new GraphQLInputObjectType({
    name: 'LoginInput',
    fields: () => ({
      emailOrUsername: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  loginOutputType = userType;

  logoutInputType = new GraphQLInputObjectType({
    name: 'LogoutInput',
    fields: () => ({}),
  });

  logoutOutputType = userType;

  confirmEmailInputType = new GraphQLInputObjectType({
    name: 'ConfirmEmailInput',
    fields: () => ({
      confirmationToken: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  confirmEmailOutputType = userType;

  resendConfirmationEmailInputType = new GraphQLInputObjectType({
    name: 'ResendConfirmation',
    fields: () => ({
      email: { type: new GraphQLNonNull(GraphQLString) },
    }),
  });

  resendConfirmationEmailOutputType = new GraphQLNonNull(GraphQLString);

  queryType = new GraphQLObjectType<undefined, GlobalCtx>({
    name: 'Query',
    fields: () => ({
      user: {
        args: { input: { type: userInputType } },
        type: userOutputType,
      },
      users: {
        args: { input: { type: usersInputType } },
        type: usersOutputType,
      },
    }),
  });

  mutationType = new GraphQLObjectType<undefined, GlobalCtx>({
    name: 'Mutation',
    fields: () => ({
      authenticate: {
        args: { input: { type: authenticateInputType } },
        type: authenticateOutputType,
      },
      signup: {
        args: { input: { type: signupInputType } },
        type: signupOutputType,
      },
      login: {
        args: { input: { type: loginInputType } },
        type: loginOutputType,
      },
      logout: {
        args: { input: { type: logoutInputType } },
        type: logoutOutputType,
      },
      confirmEmail: {
        args: { input: { type: confirmEmailInputType } },
        type: confirmEmailOutputType,
      },
      resendConfirmationEmail: {
        args: { input: { type: resendConfirmationEmailInputType } },
        type: resendConfirmationEmailOutputType,
      },
    }),
  });

  return new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
  });
};
