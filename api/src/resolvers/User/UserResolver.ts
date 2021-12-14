import { inject, injectable } from 'inversify';
import { pick } from 'lodash';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { ltAdmin } from '../../domain';
import * as errors from '../../errors';
import { TYPES } from '../../inversify.constants';
import { AuthRequirement, UserService } from '../../services';
import * as types from '../graphqlTypes';
import { NumberValue } from '../graphqlTypes/NumberValue.type';
import { WithAuthRequirement } from '../middlewares';
import { ResolverCtx } from '../types';

@Resolver()
@injectable()
export class UserResolver {
  constructor(@inject(TYPES.UserService) public userService: UserService) {}

  @Query((returns) => types.User, { nullable: true })
  async user(@Args() args: types.UserArgs): Promise<types.User | null> {
    const user = await this.userService.find(args.id);
    return user ? types.User.of(user) : null;
  }

  @Query((returns) => types.UserConnection)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_ADMIN))
  async users(@Args() args: types.UserConnectionArgs): Promise<types.UserConnection> {
    const connection = await this.userService.findPage(args);
    return types.UserConnection.of(connection);
  }

  @Mutation((returns) => types.UpdateUserOutput)
  async updateUser(
    @Arg('input') input: types.UpdateUserInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof types.UpdateUserOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn) {
      return types.ForbiddenError.of({ message: 'must be logged in' });
    }

    try {
      await types.UpdateUserInput.validate(input, ctx);
    } catch (e) {
      if (e instanceof errors.ForbiddenError) {
        return types.ForbiddenError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }

    const { id } = input;
    try {
      const attrs = pick(input, ['username', 'email', 'role']);
      const user = await this.userService.update(id, attrs);
      return types.User.of(user);
    } catch (e) {
      if (e instanceof errors.BadRequestError) {
        return types.BadRequestError.of(e);
      } else if (e instanceof errors.NotFoundError) {
        return types.NotFoundError.of(e);
      } else if (e instanceof errors.ValidationError) {
        return types.ValidationError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  @Query((returns) => types.UserCountOutput)
  async userCount(@Ctx() ctx: ResolverCtx): Promise<typeof types.UserCountOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn || ltAdmin(sessionUser.role)) {
      return types.ForbiddenError.of({ message: 'must be logged in as admin' });
    }
    const count = await this.userService.count();
    return NumberValue.of(count);
  }
}
