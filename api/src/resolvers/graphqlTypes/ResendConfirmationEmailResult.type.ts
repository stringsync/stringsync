import { Field, ObjectType } from 'type-graphql';

/**
 * An object that represents the result of calling resendConfirmationEmail.
 *
 * This is purposely vague to prevent attacks from inferring user state from the database.
 */
@ObjectType()
export class ResendConfirmationEmailResult {
  static of() {
    const resendConfirmationEmailResult = new ResendConfirmationEmailResult();
    resendConfirmationEmailResult.processed = true;
    return resendConfirmationEmailResult;
  }

  @Field()
  processed!: boolean;
}
