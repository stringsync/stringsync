import { Container } from 'inversify';
import { buildSchemaSync } from 'type-graphql';
import { UserResolver } from './resolvers';

export const generateSchema = (container: Container) => {
  return buildSchemaSync({
    resolvers: [UserResolver],
    container: {
      get: (klass) => container.get(klass),
    },
  });
};
