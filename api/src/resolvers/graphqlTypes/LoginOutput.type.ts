import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { User } from './User.type';

export const LoginOutput = createUnionType({
  name: 'LoginOutput',
  types: () => [User, ForbiddenError] as const,
});
