import { Resolver, Query, Args, UseMiddleware } from 'type-graphql';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserService } from '@stringsync/services';
import { UserObject } from './UserObject';
import { UserArgs } from './UserArgs';
import { User } from '@stringsync/domain';
import { WithAuthRequirement } from '../../middlewares';
import { AuthRequirement } from '@stringsync/common';

@Resolver()
@injectable()
export class UserResolver {
  readonly userService: UserService;

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
