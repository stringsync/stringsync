import { buildSchemaSync } from 'type-graphql';
import { Container } from '@stringsync/container';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [() => undefined],
    container: Container.instance,
  });
};
