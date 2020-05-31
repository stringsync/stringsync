import { Container } from 'inversify';
import { buildSchemaSync } from 'type-graphql';

export const generateSchema = (container: Container) => {
  return buildSchemaSync({
    resolvers: [],
    container: {
      get: (klass) => container.get(klass),
    },
  });
};
