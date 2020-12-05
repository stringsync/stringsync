import { UserConnectionObject } from './UserConnectionObject';
import { AuthRequirement, BadRequestError, Connection, NotFoundError } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { UserService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, ResolverData, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement, WithValidator } from '../../middlewares';
import { UserArgs } from './UserArgs';
import { UserObject } from './UserObject';
import { UpdateUserInput } from './UpdateUserInput';
import { pick } from 'lodash';
import { ReqCtx } from '../../../ctx';
import { UserConnectionArgs } from './UserConnectionArgs';

@Resolver()
@injectable()
export class UserResolver {
  userService: UserService;

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }

  @Query((returns) => UserObject, { nullable: true })
  async user(@Args() args: UserArgs): Promise<User | null> {
    return await this.userService.find(args.id);
  }

  @Query((returns) => UserConnectionObject)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async users(@Args() args: UserConnectionArgs): Promise<Connection<User>> {
    return await this.userService.findPage(args);
  }

  @Mutation((returns) => UserObject, { nullable: true })
  @UseMiddleware(
    WithAuthRequirement(AuthRequirement.LOGGED_IN),
    WithValidator(async (data) => {
      const input: UpdateUserInput | undefined = data.args.input;
      if (!input) {
        throw new BadRequestError('input required');
      }
      await UpdateUserInput.validate(input, data.context);
    })
  )
  async updateUser(@Arg('input') input: UpdateUserInput, @Ctx() ctx: ReqCtx): Promise<User | null> {
    const { id } = input;
    const attrs = pick(input, ['username', 'email', 'role']);
    return await this.userService.update(id, attrs);
  }
}
