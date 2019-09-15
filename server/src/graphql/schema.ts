import Query from './Query';
import Mutation from './Mutation';
import typeDefs from './type-defs';
import resolvers from './resolvers';
import { makeExecutableSchema } from 'apollo-server';

/**
 * The schema is broken up to allow the project to scale.
 * Normally, the schema would look like this:
 *
 * type Foo {
 *   id: ID!
 *   bar: String!
 *   baz: Int!
 * }
 *
 * type Query {
 *   foos: [Foo]
 * }
 *
 * type Mutation {
 *   addFoo(bar: String!, baz: Int!): Foo
 * }
 *
 * Query is defined in ./Query.ts
 * Mutation is defined in ./Mutation.ts
 * type definitions are in the ./typeDefs directory
 * resolvers are in the ./resolvers directory
 */
export default makeExecutableSchema({
  typeDefs: [Query, Mutation, ...typeDefs],
  resolvers,
});
