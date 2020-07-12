import { Resolver, Query, Ctx, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { injectable, inject } from 'inversify';
import { AuthService, NotificationService } from '@stringsync/services';
import { TYPES } from '@stringsync/container';
import { User } from '@stringsync/domain';
import { ResolverCtx } from '../../types';
import { UserObject } from '../User';
import { LoginInput } from './LoginInput';
import { ForbiddenError, AuthRequirement } from '@stringsync/common';
import { WithAuthRequirement } from '../../middlewares';
import { SignupInput } from './SignupInput';
import { ConfirmEmailInput } from './ConfirmEmailInput';

@Resolver()
@injectable()
export class AuthResolver {
  authService: AuthService;
  notificationService: NotificationService;

  constructor(
    @inject(TYPES.AuthService) authService: AuthService,
    @inject(TYPES.NotificationService) notificationService: NotificationService
  ) {
    this.authService = authService;
    this.notificationService = notificationService;
  }

  @Query((returns) => UserObject, { nullable: true })
  async whoami(@Ctx() ctx: ResolverCtx): Promise<User | null> {
    const id = this.getSessionUserId(ctx);
    return await this.authService.whoami(id);
  }

  @Mutation((returns) => UserObject)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_OUT))
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const user = await this.authService.getAuthenticatedUser(input.usernameOrEmail, input.password);
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

  @Mutation((returns) => UserObject)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_OUT))
  async signup(@Arg('input') input: SignupInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const user = await this.authService.signup(input.username, input.email, input.password);
    this.persistLogin(ctx, user);
    return user;
  }

  @Mutation((returns) => UserObject)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN))
  async confirmEmail(@Arg('input') input: ConfirmEmailInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const id = this.getSessionUserId(ctx);
    const user = await this.authService.confirmEmail(id, input.confirmationToken, ctx.reqAt);
    return user;
  }

  @Mutation((returns) => Boolean)
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN))
  async resendConfirmationEmail(@Ctx() ctx: ResolverCtx): Promise<true> {
    const id = this.getSessionUserId(ctx);
    const user = await this.authService.resetConfirmationToken(id);
    if (user) {
      await this.notificationService.sendConfirmationEmail(user);
    }

    // Silently fail to prevent attackers from inferring the confirmation state.
    return true;
  }

  private getSessionUserId(ctx: ResolverCtx) {
    return ctx.req.session.user.id;
  }

  private persistLogin(ctx: ResolverCtx, user: User) {
    ctx.req.session.user = this.authService.toSessionUser(user);
  }

  private persistLogout(ctx: ResolverCtx) {
    ctx.req.session.user = this.authService.toSessionUser(null);
  }
}
