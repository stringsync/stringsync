import { createUnionType } from 'type-graphql';
import { ForbiddenError } from '../graphqlTypes';
import { Processed } from './Processed.type';

export const ResendConfirmationEmailOutput = createUnionType({
  name: 'ResendConfirmationEmailOutput',
  types: () => [Processed, ForbiddenError] as const,
});
