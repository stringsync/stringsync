import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateNotationInput {
  @Field()
  id!: string;

  @Field({ nullable: true })
  songName?: string;

  @Field({ nullable: true })
  artistName?: string;

  @Field({ nullable: true })
  deadTimeMs?: number;

  @Field({ nullable: true })
  durationMs?: number;

  @Field({ nullable: true })
  private?: boolean;

  @Field((type) => GraphQLUpload, { nullable: true })
  thumbnail?: Promise<FileUpload>;

  @Field((type) => GraphQLUpload, { nullable: true })
  musicXml?: Promise<FileUpload>;
}
