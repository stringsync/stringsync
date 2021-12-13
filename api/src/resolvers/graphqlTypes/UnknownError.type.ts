import { Field, ObjectType } from 'type-graphql';
import { ErrorCode, StringsyncError, UNKNOWN_ERROR_MSG } from '../../errors';

@ObjectType()
export class UnknownError {
  static of(error: any) {
    const unknownError = new UnknownError();
    const message = error instanceof StringsyncError && error.isUserFacing ? error.message : UNKNOWN_ERROR_MSG;
    unknownError.message = message;
    return unknownError;
  }

  readonly code = ErrorCode.UNKNOWN;

  @Field()
  message!: string;
}
