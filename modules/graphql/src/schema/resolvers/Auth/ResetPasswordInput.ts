import { InputType, Field } from 'type-graphql';

@InputType()
export class ResetPasswordInput {
  @Field()
  resetPasswordToken!: string;

  @Field()
  password!: string;
}
