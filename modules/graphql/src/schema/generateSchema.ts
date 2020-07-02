import { buildSchemaSync } from 'type-graphql';
import { UserResolver, AuthResolver } from './resolvers';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [UserResolver, AuthResolver],
    container: ({ context }) => context.container,
    validate: false,
  });
};
