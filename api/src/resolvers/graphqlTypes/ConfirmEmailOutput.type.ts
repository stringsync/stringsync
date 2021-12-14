import { createUnionType } from 'type-graphql';
import { ForbiddenError, NotFoundError, UnknownError } from '../graphqlTypes';
import { BadRequestError } from './BadRequestError.type';
import { EmailConfirmation } from './EmailConfirmation.type';

export const ConfirmEmailOutput = createUnionType({
  name: 'ConfirmEmailOutput',
  types: () => [EmailConfirmation, NotFoundError, BadRequestError, ForbiddenError, UnknownError] as const,
});
