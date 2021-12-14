import { Field, InputType } from 'type-graphql';
import { UserRole } from '../../domain';
import { ForbiddenError } from '../../errors';
import { ResolverCtx } from '../types';

@InputType()
export class UpdateUserInput {
  static ADMIN_FIELDS = ['role'];
  static DATA_OWNER_FIELDS = ['username', 'email'];

  static async validate(input: UpdateUserInput, ctx: ResolverCtx) {
    const { role, id } = ctx.getSessionUser();
    const isAdmin = role === UserRole.ADMIN;
    const isDataOwner = id === input.id;

    const fields = new Set(Object.keys(input));
    const hasAdminFields = UpdateUserInput.ADMIN_FIELDS.some((field) => fields.has(field));
    const hasDataOwnerFields = UpdateUserInput.DATA_OWNER_FIELDS.some((field) => fields.has(field));

    if (!isAdmin && !isDataOwner) {
      throw new ForbiddenError(`must be admin or data owner to update`);
    }

    if (isAdmin && !isDataOwner && hasDataOwnerFields) {
      throw new ForbiddenError(`can only specify as an admin: fields=${UpdateUserInput.ADMIN_FIELDS}`);
    }

    if (isDataOwner && !isAdmin && hasAdminFields) {
      throw new ForbiddenError(`can only specify as a data owner: fields=${UpdateUserInput.DATA_OWNER_FIELDS}`);
    }
  }

  @Field()
  id!: string;

  @Field((type) => String, { nullable: true })
  username?: string;

  @Field((type) => String, { nullable: true })
  email?: string;

  @Field((type) => UserRole, { nullable: true })
  role?: UserRole;
}
