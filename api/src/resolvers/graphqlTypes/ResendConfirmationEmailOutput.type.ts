import { createUnionType } from 'type-graphql';
import { ForbiddenError } from '../graphqlTypes';
import { ResendConfirmationEmailResult } from './ResendConfirmationEmailResult.type';

export const ResendConfirmationEmailOutput = createUnionType({
  name: 'ResendConfirmationEmailOutput',
  types: () => [ResendConfirmationEmailResult, ForbiddenError] as const,
});
