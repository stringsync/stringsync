import { InputType, Field } from 'type-graphql';

@InputType()
export class CreateNotationInput {
  @Field()
  songName!: string;

  @Field()
  artistName!: string;
}
