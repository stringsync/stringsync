import { buildSchemaSync } from 'type-graphql';
import { ExperimentResolver } from './resolvers';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [ExperimentResolver],
    container: ({ context }) => context.container,
    validate: false,
  });
};
