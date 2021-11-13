import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class SuggestedNotationsArgs {
  @Field((type) => String, { nullable: true })
  id?: string;

  @Field((type) => Int)
  limit!: number;
}
