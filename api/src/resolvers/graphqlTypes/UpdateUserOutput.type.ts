import { createUnionType } from 'type-graphql';
import { BadRequestError } from './BadRequestError.type';
import { ForbiddenError } from './ForbiddenError.type';
import { NotFoundError } from './NotFoundError.type';
import { UnknownError } from './UnknownError.type';
import { User } from './User.type';
import { ValidationError } from './ValidationError.type';

export const UpdateUserOutput = createUnionType({
  name: 'UpdateUserOutput',
  types: () => [User, ForbiddenError, NotFoundError, BadRequestError, ValidationError, UnknownError] as const,
});
