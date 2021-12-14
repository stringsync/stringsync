import { Ctx, Field, ID, ObjectType, registerEnumType, Root } from 'type-graphql';
import { Notation as DomainNotation, User as DomainUser, UserRole } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { IsDataOwner, RestrictedField } from '../middlewares';
import { ResolverCtx } from '../types';
import { NotationObject } from './../Notation/NotationObject';

registerEnumType(UserRole, { name: 'UserRole' });

type PublicUserFields = Omit<
  DomainUser,
  'encryptedPassword' | 'confirmationToken' | 'confirmedAt' | 'resetPasswordToken' | 'cursor'
>;

@ObjectType()
export class User implements PublicUserFields {
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
  async notations(@Root() user: User, @Ctx() ctx: ResolverCtx): Promise<DomainNotation[]> {
    const notationService = ctx.getContainer().get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTranscriberId(user.id);
  }
}
