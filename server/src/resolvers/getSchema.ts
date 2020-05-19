import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLScalarType,
  Kind,
  GraphQLEnumType,
  GraphQLNonNull,
} from 'graphql';
import { GlobalCtx } from '../util/ctx';

export const getSchema = () => {
  const dateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value: string) {
      return new Date(value);
    },
    serialize(date: Date) {
      return date.getTime();
    },
    parseLiteral(ast) {
      // Only accept string dates
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  });

  const userRolesType = new GraphQLEnumType({
    name: 'UserRoles',
    values: {
      STUDENT: { value: 'student' },
      TEACHER: { value: 'teacher' },
      ADMIN: { value: 'admin' },
    },
  });

  const queryType = new GraphQLObjectType<undefined, GlobalCtx>({
    name: 'Query',
    fields: {
      hello: {
        type: new GraphQLNonNull(GraphQLString),
        resolve: () => {
          return 'Hello, from the server!';
        },
      },
    },
  });

  return new GraphQLSchema({
    description: 'GraphQL Schema for StringSync',
    query: queryType,
    types: [dateType, userRolesType],
  });
};

// export const getSchema = () => `
// # Scalar
// scalar Date

// enum UserRoles {
//   student
//   teacher
//   admin
// }

// # Types/Inputs
// type User {
//   id: String!
//   username: String!
//   email: String!
//   createdAt: Date!
//   updatedAt: Date!
//   confirmedAt: Date
//   notations: [Notation]
//   role: UserRoles!
// }

// type Notation {
//   id: String!
// }

// input GetUserInput {
//   id: String!
// }

// type AuthenticatePayload {
//   user: User!
// }

// input SignupInput {
//   username: String!
//   email: String!
//   password: String!
// }

// type SignupPayload {
//   user: User!
// }

// input LoginInput {
//   emailOrUsername: String!
//   password: String!
// }

// type LoginPayload {
//   user: User!
// }

// type LogoutPayload {
//   user: User!
// }

// input ConfirmEmailInput {
//   confirmationToken: String!
// }

// type ConfirmEmailPayload {
//   user: User!
// }

// input ResendConfirmationInput {
//   email: String!
// }

// type ResendConfirmationPayload {
//   email: String!
// }

// # Query
// type Query {
//   getUsers: [User]!
//   getUser(input: GetUserInput!): User
// }

// # Mutation
// type Mutation {
//   signup(input: SignupInput!): SignupPayload!
//   login(input: LoginInput!): LoginPayload!
//   logout: LogoutPayload!
//   authenticate: AuthenticatePayload!
//   confirmEmail(input: ConfirmEmailInput!): ConfirmEmailPayload!
//   resendConfirmation(
//     input: ResendConfirmationInput!
//   ): ResendConfirmationPayload!
// }
// `;
