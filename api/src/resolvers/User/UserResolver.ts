import { inject, injectable } from 'inversify';
import { pick } from 'lodash';
import { Arg, Args, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../../domain';
import { BadRequestError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { AuthRequirement, UserService } from '../../services';
import { Connection } from '../../util';
import { WithAuthRequirement, WithValidator } from '../middlewares';
import { ResolverCtx } from '../types';
import { UpdateUserInput } from './UpdateUserInput';
import { UserArgs } from './UserArgs';
import { UserConnectionArgs } from './UserConnectionArgs';
import { UserConnectionObject } from './UserConnectionObject';
import { UserObject } from './UserObject';

@Resolver()
@injectable()
export class UserResolver {
  constructor(@inject(TYPES.UserService) public userService: UserService) {}

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
    WithValidator<ResolverCtx>(async (data) => {
      const input: UpdateUserInput | undefined = data.args.input;
      if (!input) {
        throw new BadRequestError('input required');
      }
      await UpdateUserInput.validate(input, data.context);
    })
  )
  async updateUser(@Arg('input') input: UpdateUserInput): Promise<User | null> {
    const { id } = input;
    const attrs = pick(input, ['username', 'email', 'role']);
    return await this.userService.update(id, attrs);
  }

  @Query((returns) => Number)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async count(): Promise<number> {
    return await this.userService.count();
  }
}
