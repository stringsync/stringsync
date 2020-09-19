import { UserConnectionObject } from './UserConnectionObject';
import { AuthRequirement, Connection, NotFoundError } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { UserService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement } from '../../middlewares';
import { ConnectionArgs } from './../Paging';
import { UserArgs } from './UserArgs';
import { UserObject } from './UserObject';
import { UpdateUserInput } from './UpdateUserInput';
import { ResolverCtx } from '../../types';
import { pick } from 'lodash';

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

  @Mutation((returns) => UserObject)
  async updateUser(@Arg('input') input: UpdateUserInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const { id } = input;

    const user = await this.userService.find(id);
    if (!user) {
      throw new NotFoundError('user not found');
    }

    const attrs = pick(input, ['username', 'email', 'role']);
    const updatedUser = { ...attrs, ...user };
    await this.userService.update(id, updatedUser);

    return updatedUser;
  }
}
