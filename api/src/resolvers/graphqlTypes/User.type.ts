import { Ctx, Field, ID, ObjectType, registerEnumType, Root } from 'type-graphql';
import * as domain from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { IsDataOwner, RestrictedField } from '../middlewares';
import { ResolverCtx } from '../types';
import { Notation } from './Notation.type';

registerEnumType(domain.UserRole, { name: 'UserRole' });

type PublicUserFields = Omit<
  domain.User,
  'encryptedPassword' | 'confirmationToken' | 'confirmedAt' | 'resetPasswordToken' | 'cursor'
>;

@ObjectType()
export class User implements PublicUserFields {
  static of(attrs: domain.User) {
    const user = new User();
    user.id = attrs.id;
    user.createdAt = attrs.createdAt;
    user.updatedAt = attrs.updatedAt;
    user.email = attrs.email;
    user.username = attrs.username;
    user.avatarUrl = attrs.avatarUrl;
    user.role = attrs.role;
    user.confirmedAt = attrs.confirmedAt;
    user.resetPasswordTokenSentAt = attrs.resetPasswordTokenSentAt;
    return user;
  }

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

  @Field((type) => domain.UserRole)
  role!: domain.UserRole;

  @Field((type) => Date, { nullable: true })
  @RestrictedField(IsDataOwner)
  confirmedAt!: Date | null;

  @Field((type) => Date, { nullable: true })
  @RestrictedField(IsDataOwner)
  resetPasswordTokenSentAt!: Date | null;

  @Field((type) => [Notation])
  async notations(@Ctx() ctx: ResolverCtx): Promise<domain.Notation[]> {
    const notationService = ctx.getContainer().get<NotationService>(TYPES.NotationService);
    return await notationService.findAllByTranscriberId(this.id);
  }
}
