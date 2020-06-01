import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import * as domain from '@stringsync/domain';
import { UserRoles } from '@stringsync/domain';

registerEnumType(UserRoles, { name: 'UserRoles' });

@ObjectType()
export class User implements domain.User {
  @Field((type) => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  username!: string;

  @Field()
  email!: string;

  @Field()
  encryptedPassword!: string;

  @Field((type) => UserRoles)
  role!: UserRoles;

  @Field((type) => String, { nullable: true })
  confirmationToken!: string | null;

  @Field((type) => Date, { nullable: true })
  confirmedAt!: Date | null;

  @Field((type) => String, { nullable: true })
  resetPasswordToken!: string | null;

  @Field((type) => Date, { nullable: true })
  resetPasswordTokenSentAt!: Date | null;

  @Field((type) => String, { nullable: true })
  avatarUrl!: string | null;
}
