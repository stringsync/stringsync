import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNotationInput {
  @Field()
  songName!: string;

  @Field()
  artistName!: string;

  @Field((type) => GraphQLUpload)
  thumbnail!: FileUpload;

  @Field((type) => GraphQLUpload)
  video!: FileUpload;
}
