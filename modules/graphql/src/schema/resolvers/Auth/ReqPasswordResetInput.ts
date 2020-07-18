import { InputType, Field } from 'type-graphql';

@InputType()
export class ReqPasswordResetInput {
  @Field()
  email!: string;
}
