import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class UserArgs {
  @Field()
  id!: string;
}
