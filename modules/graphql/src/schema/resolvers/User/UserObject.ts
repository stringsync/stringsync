import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import * as domain from '@stringsync/domain';
import { UserRole } from '@stringsync/domain';

registerEnumType(UserRole, { name: 'UserRoles' });

@ObjectType()
export class UserObject implements domain.User {
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

  @Field((type) => UserRole)
  role!: UserRole;

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
