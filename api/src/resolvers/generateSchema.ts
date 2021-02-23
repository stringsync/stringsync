import { buildSchemaSync } from 'type-graphql';
import { AuthResolver } from './Auth';
import { ExperimentResolver } from './Experiment';
import { NotationResolver } from './Notation';
import { ResolverCtx } from './types';
import { UserResolver } from './User';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [UserResolver, AuthResolver, NotationResolver, ExperimentResolver],
    container: ({ context }) => (context as ResolverCtx).getContainer(),
    validate: false,
  });
};
