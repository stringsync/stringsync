import { createUnionType } from 'type-graphql';
import { BadRequestError } from './BadRequestError.type';
import { ForbiddenError } from './ForbiddenError.type';
import { Tag } from './Tag.type';
import { UnknownError } from './UnknownError.type';

export const CreateTagOutput = createUnionType({
  name: 'CreateTagOutput',
  types: () => [Tag, ForbiddenError, BadRequestError, UnknownError] as const,
});
