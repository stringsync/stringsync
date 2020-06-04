import { Resolver, Query, Args } from 'type-graphql';
import { injectable, inject } from 'inversify';
import { TYPES } from '@stringsync/container';
import { UserService } from '@stringsync/services';
import { User } from './User';
import { UserArgs } from './UserArgs';
import * as domain from '@stringsync/domain';

@Resolver()
@injectable()
export class UserResolver {
  readonly userService: UserService;

  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }

  @Query((returns) => User, { nullable: true })
  async user(@Args() args: UserArgs): Promise<domain.User | null> {
    return await this.userService.get(args.id);
  }

  @Query((returns) => [User])
  async users(): Promise<domain.User[]> {
    return await this.userService.all();
  }
}
