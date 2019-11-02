import { FieldResolver } from '../../resolvers';

export type ResolverGuard = (
  resolver: FieldResolver<any, any, any>
) => FieldResolver<any, any, any>;
