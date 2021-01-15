import { Field, InputType } from 'type-graphql';

@InputType()
export class SendResetPasswordEmailInput {
  @Field()
  email!: string;
}
