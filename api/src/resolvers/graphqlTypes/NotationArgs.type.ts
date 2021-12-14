import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class NotationArgs {
  @Field()
  id!: string;
}
