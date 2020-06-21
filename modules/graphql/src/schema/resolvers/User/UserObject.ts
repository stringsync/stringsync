import { NotationObject } from './../Notation';
import { ObjectType, Field, ID, registerEnumType } from 'type-graphql';
import { User, UserRole, Notation } from '@stringsync/domain';
import { RestrictedField } from './RestrictedField';
import { IsDataOwner } from './IsDataOwner';

type PublicFacingUser = Omit<User, 'encryptedPassword' | 'confirmationToken' | 'confirmedAt' | 'resetPasswordToken'>;

registerEnumType(UserRole, { name: 'UserRoles' });

@ObjectType()
export class UserObject implements PublicFacingUser {
  @Field((type) => ID)
  id!: number;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  @RestrictedField(IsDataOwner)
  email!: string;

  @Field()
  username!: string;

  @Field((type) => String, { nullable: true })
  avatarUrl!: string | null;

  @Field((type) => UserRole)
  role!: UserRole;

  @Field((type) => Date, { nullable: true })
  @RestrictedField(IsDataOwner)
  confirmedAt!: Date | null;

  @Field((type) => Date, { nullable: true })
  @RestrictedField(IsDataOwner)
  resetPasswordTokenSentAt!: Date | null;

  @Field((type) => [NotationObject])
  notations!: Notation[];
}
