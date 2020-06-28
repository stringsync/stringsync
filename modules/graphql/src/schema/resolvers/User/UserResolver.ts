import { AuthRequirement } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { User } from '@stringsync/domain';
import { UserService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Args, Query, Resolver, UseMiddleware } from 'type-graphql';
import { WithAuthRequirement } from '../../middlewares';
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

  @Query((returns) => [UserObject])
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async users(): Promise<User[]> {
    return await this.userService.findAll();
  }
}
