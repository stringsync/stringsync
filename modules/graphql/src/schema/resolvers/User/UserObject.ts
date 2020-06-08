import { ObjectType, Field, ID, registerEnumType, UseMiddleware } from 'type-graphql';
import { User, UserRole } from '@stringsync/domain';
import { IsDataOwner } from './IsDataOwner';
import { Branch } from '../../middlewares/Branch';
import { Identity } from '../../middlewares/Identity';
import { WithAuthRequirement, WithErrorHandler } from '../../middlewares';
import { AuthRequirement, ForbiddenError } from '@stringsync/common';

type PublicFacingUser = Omit<User, 'encryptedPassword' | 'confirmationToken' | 'confirmedAt' | 'resetPasswordToken'>;

registerEnumType(UserRole, { name: 'UserRoles' });

@ObjectType()
export class UserObject implements PublicFacingUser {
  @Field((type) => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  username!: string;

  @Field()
  @UseMiddleware(
    WithErrorHandler((err) => {
      if (err instanceof ForbiddenError) {
        throw new ForbiddenError('must be logged in as data owner or admin');
      }
      throw err;
    }),
    Branch(IsDataOwner, Identity, WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  )
  email!: string;

  @Field((type) => UserRole)
  role!: UserRole;

  @Field((type) => Date, { nullable: true })
  confirmedAt!: Date | null;

  @Field((type) => Date, { nullable: true })
  resetPasswordTokenSentAt!: Date | null;

  @Field((type) => String, { nullable: true })
  avatarUrl!: string | null;
}
