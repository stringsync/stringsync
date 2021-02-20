import { Handler } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Ctx } from './Ctx';
import { formatError } from './formatError';

export const withGraphQL = (schema: GraphQLSchema): Handler => (req, res) => {
  const ctx = Ctx.get(req);

  const middleware = graphqlHTTP({
    schema,
    context: ctx.toObject(),
    graphiql: false,
    customFormatErrorFn: formatError,
  });

  return middleware(req, res);
};
