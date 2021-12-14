import { createUnionType } from 'type-graphql';
import { BadRequestError } from './BadRequestError.type';
import { ForbiddenError } from './ForbiddenError.type';
import { Notation } from './Notation.type';
import { NotFoundError } from './NotFoundError.type';
import { UnknownError } from './UnknownError.type';
import { ValidationError } from './ValidationError.type';

export const UpdateNotationOutput = createUnionType({
  name: 'UpdateNotationOutput',
  types: () => [Notation, ForbiddenError, NotFoundError, BadRequestError, ValidationError, UnknownError] as const,
});
