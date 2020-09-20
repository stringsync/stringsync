import { BadRequestError } from '@stringsync/common';
import { UserRole } from '@stringsync/domain';
import { intersection } from 'lodash';
import { pick } from 'lodash';
import { Field, InputType } from 'type-graphql';
import { ReqCtx } from '../../../ctx';

@InputType()
export class UpdateUserInput {
  static ADMIN_FIELDS = ['role'];
  static DATA_OWNER_FIELDS = ['username', 'email'];

  static async validate(input: UpdateUserInput, ctx: ReqCtx) {
    const { role, id } = ctx.req.session.user;
    const isAdmin = role === UserRole.ADMIN;
    const isDataOwner = id === input.id;

    const fields = new Set(Object.keys(input));
    const hasAdminFields = UpdateUserInput.ADMIN_FIELDS.some((field) => fields.has(field));
    const hasDataOwnerFields = UpdateUserInput.DATA_OWNER_FIELDS.some((field) => fields.has(field));

    if (isAdmin && !isDataOwner && hasDataOwnerFields) {
      throw new BadRequestError(`can only specify: ${UpdateUserInput.ADMIN_FIELDS}`);
    }

    if (isDataOwner && !isAdmin && hasAdminFields) {
      throw new BadRequestError(`can only specify: ${UpdateUserInput.DATA_OWNER_FIELDS}`);
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

  // TODO: Uncomment when ready for avatar uploads
  // @Field((type) => GraphQLUpload, { nullable: true })
  // avatar?: Promise<FileUpload>;
}
