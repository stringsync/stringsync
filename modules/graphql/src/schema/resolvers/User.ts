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

  @Field()
  confirmationToken!: string | null;

  @Field()
  confirmedAt!: Date | null;

  @Field()
  resetPasswordToken!: string | null;

  @Field()
  resetPasswordTokenSentAt!: Date | null;

  @Field()
  avatarUrl!: string | null;
}
