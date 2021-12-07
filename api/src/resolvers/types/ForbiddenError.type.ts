import { Field, ObjectType } from 'type-graphql';
import { ErrorCode } from '../../errors';

@ObjectType()
export class ForbiddenError {
  static of(message: string) {
    const forbiddenError = new ForbiddenError();
    forbiddenError.message = message;
    return forbiddenError;
  }

  readonly code = ErrorCode.FORBIDDEN;

  @Field()
  message!: string;
}
