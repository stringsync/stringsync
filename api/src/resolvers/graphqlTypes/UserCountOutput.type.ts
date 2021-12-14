import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { NumberValue } from './NumberValue.type';
import { UnknownError } from './UnknownError.type';

export const UserCountOutput = createUnionType({
  name: 'UserCountOutput',
  types: () => [NumberValue, ForbiddenError, UnknownError] as const,
});
