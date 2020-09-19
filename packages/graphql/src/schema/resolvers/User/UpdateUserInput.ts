import { UserRole } from '@stringsync/domain';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field()
  id!: string;

  @Field((type) => String, { nullable: true })
  username?: string;

  @Field((type) => String, { nullable: true })
  email?: string;

  @Field((type) => UserRole, { nullable: true })
  role?: UserRole;

  // TODO: Uncomment when ready for avatar uploads
  // @Field((type) => GraphQLUpload, { nullable: true })
  // avatar?: Promise<FileUpload>;
}
