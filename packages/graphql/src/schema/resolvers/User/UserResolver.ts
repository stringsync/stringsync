import { UserConnectionObject } from './UserConnectionObject';
import { AuthRequirement, Connection, NotFoundError } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { UserService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, ResolverData, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement, WithValidator } from '../../middlewares';
import { ConnectionArgs } from './../Paging';
import { UserArgs } from './UserArgs';
import { UserObject } from './UserObject';
import { UpdateUserInput } from './UpdateUserInput';
import { pick } from 'lodash';
import { ReqCtx } from '../../../ctx';

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
  async users(@Args() args: ConnectionArgs): Promise<Connection<User>> {
    return await this.userService.findPage(args);
  }

  @Mutation((returns) => UserObject, { nullable: true })
  @UseMiddleware(
    WithAuthRequirement(AuthRequirement.LOGGED_IN),
    WithValidator(async (data: ResolverData<ReqCtx>) => {
      const input: UpdateUserInput = data.args.input;
    })
  )
  async updateUser(@Arg('input') input: UpdateUserInput, @Ctx() ctx: ReqCtx): Promise<User | null> {
    const { id } = input;
    const attrs = pick(input, ['username', 'email', 'role']);
    return await this.userService.update(id, attrs);
  }
}
