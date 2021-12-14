import { createUnionType } from 'type-graphql';
import { ForbiddenError, NotFoundError, UnknownError, ValidationError } from '../graphqlTypes';
import { EmailConfirmation } from './EmailConfirmation.type';

export const ConfirmEmailOutput = createUnionType({
  name: 'ConfirmEmailOutput',
  types: () => [EmailConfirmation, NotFoundError, ValidationError, ForbiddenError, UnknownError] as const,
});
