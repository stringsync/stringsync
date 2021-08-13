import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class SuggestedNotationsArgs {
  @Field()
  id!: string;

  @Field((type) => Int)
  limit!: number;
}
