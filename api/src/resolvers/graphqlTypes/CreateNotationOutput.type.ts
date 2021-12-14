import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { Notation } from './Notation.type';
import { UnknownError } from './UnknownError.type';
import { ValidationError } from './ValidationError.type';

export const CreateNotationOutput = createUnionType({
  name: 'CreateNotationOutput',
  types: () => [Notation, ForbiddenError, ValidationError, UnknownError] as const,
});
