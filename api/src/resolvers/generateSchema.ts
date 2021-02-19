import { buildSchemaSync } from 'type-graphql';
import { ExperimentResolver } from './Experiment';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [ExperimentResolver],
    container: ({ context }) => context.container,
    validate: false,
  });
};
