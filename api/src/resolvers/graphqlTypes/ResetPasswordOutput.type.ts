import { createUnionType } from 'type-graphql';
import { BadRequestError } from './BadRequestError.type';
import { Processed } from './Processed.type';
import { UnknownError } from './UnknownError.type';

export const ResetPasswordOutput = createUnionType({
  name: 'ResetPasswordOutput',
  types: () => [Processed, BadRequestError, UnknownError] as const,
});
