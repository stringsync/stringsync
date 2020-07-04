import { TYPES } from '@stringsync/container';
import { Notation, User, UserRole } from '@stringsync/domain';
import { NotationService } from '@stringsync/services';
import { Ctx, Field, ID, ObjectType, registerEnumType, Root } from 'type-graphql';
import { ReqCtx } from '../../../ctx';
import { NotationObject } from './../Notation';
import { IsDataOwner } from './IsDataOwner';
import { RestrictedField } from './RestrictedField';

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
  async notations(@Root() user: User, @Ctx() ctx: ReqCtx): Promise<Notation[]> {
    const notationService = ctx.container.get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTranscriberId(user.id);
  }
}
