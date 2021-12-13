import { createUnionType, ObjectType } from 'type-graphql';
import { ForbiddenError, UnknownError } from '../graphqlTypes';

@ObjectType()
export class ResendConfirmationEmailProcessed {
  static of() {
    // This is purposely vague to prevent attacks from inferring user state from the database.
    return new ResendConfirmationEmailProcessed();
  }
}

export const ResendConfirmationEmailOutput = createUnionType({
  name: 'ResendConfirmationEmailOutput',
  types: () => [ResendConfirmationEmailProcessed, ForbiddenError, UnknownError] as const,
});
