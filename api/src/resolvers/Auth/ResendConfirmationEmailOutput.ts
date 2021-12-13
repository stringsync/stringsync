import { createUnionType, Field, ObjectType } from 'type-graphql';
import { ForbiddenError } from '../graphqlTypes';

@ObjectType()
export class ResendConfirmationEmailResult {
  static of() {
    // This is purposely vague to prevent attacks from inferring user state from the database.
    const resendConfirmationEmailResult = new ResendConfirmationEmailResult();
    resendConfirmationEmailResult.processed = true;
    return resendConfirmationEmailResult;
  }

  @Field()
  processed!: boolean;
}

export const ResendConfirmationEmailOutput = createUnionType({
  name: 'ResendConfirmationEmailOutput',
  types: () => [ResendConfirmationEmailResult, ForbiddenError] as const,
});
