import { Field, ObjectType } from 'type-graphql';
import { ErrorCode, UNKNOWN_ERROR_MSG } from '../../errors';

@ObjectType()
export class UnknownError {
  static of(message: string = UNKNOWN_ERROR_MSG) {
    const unknownError = new UnknownError();
    unknownError.message = message;
    return unknownError;
  }

  readonly code = ErrorCode.UNKNOWN;

  @Field()
  message!: string;
}
