import { InputType, Field } from 'type-graphql';

@InputType()
export class ConfirmEmailInput {
  @Field()
  confirmationToken!: string;
}
