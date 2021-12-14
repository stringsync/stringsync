import { createUnionType } from 'type-graphql';
import { ForbiddenError } from './ForbiddenError.type';
import { Processed } from './Processed.type';
import { UnknownError } from './UnknownError.type';

export const DeleteTagOutput = createUnionType({
  name: 'DeleteTagOutput',
  types: () => [Processed, ForbiddenError, UnknownError] as const,
});
