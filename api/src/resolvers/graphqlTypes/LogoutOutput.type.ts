import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { Processed } from './Processed.type';

export const LogoutOutput = createUnionType({
  name: 'LogoutOutput',
  types: () => [Processed, ForbiddenError] as const,
});
