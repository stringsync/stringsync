import { buildSchemaSync } from 'type-graphql';
import { UserResolver } from './resolvers';
import { Container } from '@stringsync/container';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [UserResolver],
    container: Container.instance,
  });
};
