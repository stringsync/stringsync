import { Field, ObjectType } from 'type-graphql';
import { ErrorCode } from '../../errors';

@ObjectType()
export class BadRequestError {
  static of(message: string) {
    const badRequestError = new BadRequestError();
    badRequestError.message = message;
    return badRequestError;
  }

  readonly code = ErrorCode.BAD_REQUEST;

  @Field()
  message!: string;
}
