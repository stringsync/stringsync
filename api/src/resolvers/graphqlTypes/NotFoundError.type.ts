import { Field, ObjectType } from 'type-graphql';
import { ErrorCode } from '../../errors';

@ObjectType()
export class NotFoundError {
  static of(message: string) {
    const notFoundError = new NotFoundError();
    notFoundError.message = message;
    return notFoundError;
  }

  readonly code = ErrorCode.NOT_FOUND;

  @Field()
  message!: string;
}
