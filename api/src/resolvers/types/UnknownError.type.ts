import { Field, ObjectType } from 'type-graphql';
import { ErrorCode } from '../../errors';

@ObjectType()
export class UnknownError {
  readonly code = ErrorCode.UNKNOWN;

  @Field()
  message!: string;
}
