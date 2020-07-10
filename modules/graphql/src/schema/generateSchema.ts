import { buildSchemaSync } from 'type-graphql';
import { UserResolver, NotationResolver, AuthResolver } from './resolvers';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [UserResolver, AuthResolver, NotationResolver],
    container: ({ context }) => context.container,
    validate: false,
  });
};
