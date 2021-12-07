import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class InternalError {
  @Field()
  message!: string;
}
