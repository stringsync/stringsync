import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { UnknownError } from './UnknownError.type';
import { User } from './User.type';
import { ValidationError } from './ValidationError.type';

export const SignupOutput = createUnionType({
  name: 'SignupOutput',
  types: () => [User, ForbiddenError, ValidationError, UnknownError] as const,
});
