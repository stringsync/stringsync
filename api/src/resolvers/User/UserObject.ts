import { Ctx, Field, ID, ObjectType, registerEnumType, Root } from 'type-graphql';
import { Notation, User, UserRole } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { ResolverCtx } from '../types';
import { NotationObject } from './../Notation/NotationObject';
import { IsDataOwner } from './IsDataOwner';
import { RestrictedField } from './RestrictedField';

type PublicUser = Omit<
  User,
  'encryptedPassword' | 'confirmationToken' | 'confirmedAt' | 'resetPasswordToken' | 'cursor'
>;

registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
export class UserObject implements PublicUser {
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

  @Field((type) => NotationObject, { nullable: true })
  async notations(@Root() user: User, @Ctx() ctx: ResolverCtx): Promise<Notation[]> {
    const notationService = ctx.getContainer().get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTranscriberId(user.id);
  }
}
