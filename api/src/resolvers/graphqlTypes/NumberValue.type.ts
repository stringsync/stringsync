import { Field, ObjectType } from 'type-graphql';
import { ErrorCode } from '../../errors';

@ObjectType()
export class NumberValue {
  static of(value: number) {
    const numberValue = new NumberValue();
    numberValue.value = value;
    return numberValue;
  }

  readonly code = ErrorCode.UNKNOWN;

  @Field()
  value!: number;
}
