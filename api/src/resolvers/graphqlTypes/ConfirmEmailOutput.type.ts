import { createUnionType } from 'type-graphql';
import { BadRequestError, ForbiddenError, NotFoundError, UnknownError } from '../graphqlTypes';
import { EmailConfirmation } from './EmailConfirmation.type';

export const ConfirmEmailOutput = createUnionType({
  name: 'ConfirmEmailOutput',
  types: () => [EmailConfirmation, NotFoundError, BadRequestError, ForbiddenError, UnknownError] as const,
});
