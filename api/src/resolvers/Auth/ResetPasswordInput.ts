import { Field, InputType } from 'type-graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  email!: string;

  @Field()
  resetPasswordToken!: string;

  @Field()
  password!: string;
}
