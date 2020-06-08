import { InputType, Field } from 'type-graphql';

@InputType()
export class SignupInput {
  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}
