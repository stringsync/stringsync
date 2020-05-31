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

  @Field({ nullable: true })
  confirmationToken!: string | null;

  @Field({ nullable: true })
  confirmedAt!: Date | null;

  @Field({ nullable: true })
  resetPasswordToken!: string | null;

  @Field({ nullable: true })
  resetPasswordTokenSentAt!: Date | null;

  @Field({ nullable: true })
  avatarUrl!: string | null;
}
