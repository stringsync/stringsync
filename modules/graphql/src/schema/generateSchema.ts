import { buildSchemaSync } from 'type-graphql';
import { UserResolver } from './resolvers';
import { Container } from 'inversify';

export const generateSchema = (container: Container) => {
  return buildSchemaSync({
    resolvers: [UserResolver],
    container,
    validate: false,
  });
};
