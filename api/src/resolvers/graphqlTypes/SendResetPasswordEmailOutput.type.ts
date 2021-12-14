import { createUnionType } from 'type-graphql';
import { NotFoundError } from './NotFoundError.type';
import { Processed } from './Processed.type';
import { UnknownError } from './UnknownError.type';

export const SendResetPasswordEmailOutput = createUnionType({
  name: 'SendResetPasswordEmailOutput',
  types: () => [Processed, NotFoundError, UnknownError] as const,
});
