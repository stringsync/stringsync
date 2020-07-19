import { InputType, Field } from 'type-graphql';

@InputType()
export class SendResetPasswordEmailInput {
  @Field()
  email!: string;
}
