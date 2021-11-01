import { buildSchemaSync } from 'type-graphql';
import { AuthResolver } from './Auth';
import { MetaResolver } from './Meta';
import { NotationResolver } from './Notation';
import { TagResolver } from './Tag';
import { ResolverCtx } from './types';
import { UserResolver } from './User';

export const generateSchema = () => {
  return buildSchemaSync({
    resolvers: [UserResolver, AuthResolver, NotationResolver, TagResolver, MetaResolver],
    container: ({ context }) => (context as ResolverCtx).getContainer(),
    validate: false,
  });
};
