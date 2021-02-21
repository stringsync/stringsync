import { buildSchemaSync } from 'type-graphql';
import { ExperimentResolver } from './Experiment';
import { ResolverCtx } from './types';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [ExperimentResolver],
    container: ({ context }) => (context as ResolverCtx).getContainer(),
    validate: false,
  });
};
