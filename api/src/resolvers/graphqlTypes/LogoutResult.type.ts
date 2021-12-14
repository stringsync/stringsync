import { Field, ObjectType } from 'type-graphql';

/**
 * An object that represents the result of calling logout.
 *
 * This is purposely vague to prevent attacks from inferring user state from the database.
 */
@ObjectType()
export class LogoutResult {
  static of(isSuccessful: boolean) {
    const logoutResult = new LogoutResult();
    logoutResult.isSuccessful = isSuccessful;
    return logoutResult;
  }

  @Field()
  isSuccessful!: boolean;
}
