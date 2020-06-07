import { buildSchemaSync } from 'type-graphql';
import { UserResolver, AuthResolver } from './resolvers';
import { Container } from 'inversify';

export const generateSchema = (container: Container) => {
  return buildSchemaSync({
    resolvers: [UserResolver, AuthResolver],
    container,
    validate: false,
  });
};
