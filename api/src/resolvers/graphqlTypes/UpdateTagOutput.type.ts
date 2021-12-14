import { createUnionType } from 'type-graphql';
import { BadRequestError } from './BadRequestError.type';
import { ForbiddenError } from './ForbiddenError.type';
import { NotFoundError } from './NotFoundError.type';
import { Tag } from './Tag.type';
import { UnknownError } from './UnknownError.type';
import { ValidationError } from './ValidationError.type';

export const UpdateTagOutput = createUnionType({
  name: 'UpdateTagOutput',
  types: () => [Tag, ForbiddenError, NotFoundError, BadRequestError, ValidationError, UnknownError] as const,
});
