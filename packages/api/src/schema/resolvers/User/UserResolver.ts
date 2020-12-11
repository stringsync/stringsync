import { AuthRequirement, BadRequestError, Connection } from '@stringsync/common';
import { inject, injectable } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { SERVICES_TYPES, UserService } from '@stringsync/services';
import { pick } from 'lodash';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ReqCtx } from '../../../ctx';
import { WithAuthRequirement, WithValidator } from '../../middlewares';
import { UpdateUserInput } from './UpdateUserInput';
import { UserArgs } from './UserArgs';
import { UserConnectionArgs } from './UserConnectionArgs';
import { UserConnectionObject } from './UserConnectionObject';
import { UserObject } from './UserObject';

@Resolver()
@injectable()
export class UserResolver {
  userService: UserService;

  constructor(@inject(SERVICES_TYPES.UserService) userService: UserService) {
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
