import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateNotationInput {
  @Field()
  songName!: string;

  @Field()
  artistName!: string;

  @Field((type) => GraphQLUpload)
  thumbnail!: Promise<FileUpload>;

  @Field((type) => GraphQLUpload)
  video!: Promise<FileUpload>;
}
