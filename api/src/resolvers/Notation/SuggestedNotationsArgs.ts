import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class SuggestedNotationsArgs {
  @Field()
  id!: string;

  @Field()
  limit!: number;
}
