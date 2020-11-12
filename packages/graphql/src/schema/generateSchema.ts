import { buildSchemaSync } from 'type-graphql';
import { AuthResolver, ExperimentResolver, NotationResolver, UserResolver } from './resolvers';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [UserResolver, AuthResolver, NotationResolver, ExperimentResolver],
    container: ({ context }) => context.container,
    validate: false,
  });
};
