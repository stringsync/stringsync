import { UserConnectionObject } from './UserConnectionObject';
import { AuthRequirement, Connection } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { UserService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Args, Query, Resolver, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement } from '../../middlewares';
import { ConnectionArgs } from './../Paging';
import { UserArgs } from './UserArgs';
import { UserObject } from './UserObject';

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
}
