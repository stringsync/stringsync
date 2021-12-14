import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { LogoutResult } from './LogoutResult.type';

export const LogoutOutput = createUnionType({
  name: 'LogoutOutput',
  types: () => [LogoutResult, ForbiddenError] as const,
});
