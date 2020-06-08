import { Resolver, Query, Ctx, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { injectable, inject } from 'inversify';
import { AuthService } from '@stringsync/services';
import { TYPES } from '@stringsync/container';
import { User } from '@stringsync/domain';
import { ResolverCtx } from '../../types';
import { UserObject } from '../User';
import { LoginInput } from './LoginInput';
import { ForbiddenError, AuthRequirement } from '@stringsync/common';
import { WithAuthRequirement } from '../../middlewares';

@Resolver()
@injectable()
export class AuthResolver {
  readonly authService: AuthService;

  constructor(@inject(TYPES.AuthService) authService: AuthService) {
    this.authService = authService;
  }

  @Query((returns) => UserObject, { nullable: true })
  async whoami(@Ctx() ctx: ResolverCtx): Promise<User | null> {
    const id = ctx.req.session.user.id;
    return await this.authService.whoami(id);
  }

  @Mutation((returns) => UserObject)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_OUT))
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const { usernameOrEmail, password } = input;

    const user = await this.authService.getAuthenticatedUser(usernameOrEmail, password);
    if (!user) {
      throw new ForbiddenError('wrong username, email, or password');
    }

    this.persistLogin(ctx, user);

    return user;
  }

  @Mutation((returns) => Boolean)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN))
  async logout(@Ctx() ctx: ResolverCtx): Promise<boolean> {
    const wasLoggedIn = ctx.req.session.user.isLoggedIn;

    this.persistLogout(ctx);

    return wasLoggedIn;
  }

  private persistLogin(ctx: ResolverCtx, user: User) {
    ctx.req.session.user = this.authService.toSessionUser(user);
  }

  private persistLogout(ctx: ResolverCtx) {
    ctx.req.session.user = this.authService.toSessionUser(null);
  }
}
