import { inject, injectable } from 'inversify';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../../domain';
import { ForbiddenError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { AuthRequirement, AuthService, NotificationService } from '../../services';
import { Logger } from '../../util';
import { WithAuthRequirement } from '../middlewares';
import { ResolverCtx } from '../types';
import { UserObject } from '../User';
import { ConfirmEmailInput } from './ConfirmEmailInput';
import { LoginInput } from './LoginInput';
import { ResetPasswordInput } from './ResetPasswordInput';
import { SendResetPasswordEmailInput } from './SendResetPasswordEmailInput';
import { SignupInput } from './SignupInput';

@Resolver()
@injectable()
export class AuthResolver {
  constructor(
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.AuthService) public authService: AuthService,
    @inject(TYPES.NotificationService) public notificationService: NotificationService
  ) {}

  @Query((returns) => UserObject, { nullable: true })
  async whoami(@Ctx() ctx: ResolverCtx): Promise<User | null> {
    const id = this.getSessionUserId(ctx);
    return await this.authService.whoami(id);
  }

  @Mutation((returns) => UserObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_OUT))
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const user = await this.authService.getAuthenticatedUser(input.usernameOrEmail, input.password);
    if (!user) {
      throw new ForbiddenError('wrong username, email, or password');
    }

    this.persistLogin(ctx, user);

    return user;
  }

  @Mutation((returns) => Boolean, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN))
  async logout(@Ctx() ctx: ResolverCtx): Promise<boolean> {
    const wasLoggedIn = ctx.getSessionUser().isLoggedIn;
    this.persistLogout(ctx);
    return wasLoggedIn;
  }

  @Mutation((returns) => UserObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_OUT))
  async signup(@Arg('input') input: SignupInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const user = await this.authService.signup(input.username, input.email, input.password);
    await this.notificationService.sendConfirmationEmail(user);
    this.persistLogin(ctx, user);
    return user;
  }

  @Mutation((returns) => UserObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN))
  async confirmEmail(@Arg('input') input: ConfirmEmailInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const id = this.getSessionUserId(ctx);
    const user = await this.authService.confirmEmail(id, input.confirmationToken, ctx.getReqAt());
    return user;
  }

  @Mutation((returns) => Boolean, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN))
  async resendConfirmationEmail(@Ctx() ctx: ResolverCtx): Promise<true> {
    const id = this.getSessionUserId(ctx);
    try {
      const user = await this.authService.resetConfirmationToken(id);
      if (user) {
        await this.notificationService.sendConfirmationEmail(user);
      }
    } catch (e) {
      this.logger.error(`resendConfirmationEmail attempted for userId: ${id}, got error ${e}`);
    }

    // Silently fail to prevent attackers from inferring the confirmation state.
    return true;
  }

  @Mutation((returns) => Boolean, { nullable: true })
  async sendResetPasswordEmail(
    @Ctx() ctx: ResolverCtx,
    @Arg('input') input: SendResetPasswordEmailInput
  ): Promise<true> {
    const email = input.email;

    try {
      const user = await this.authService.refreshResetPasswordToken(email, ctx.getReqAt());
      await this.notificationService.sendResetPasswordEmail(user);
    } catch (e) {
      this.logger.error(`could not send reset password email for '${email}', skipping:\n${e.message}`);
      // TODO send an email saying that an attempt was made
    }

    return true;
  }

  @Mutation((returns) => Boolean, { nullable: true })
  async resetPassword(@Ctx() ctx: ResolverCtx, @Arg('input') input: ResetPasswordInput): Promise<true> {
    await this.authService.resetPassword(input.email, input.resetPasswordToken, input.password, ctx.getReqAt());
    return true;
  }

  private getSessionUserId(ctx: ResolverCtx) {
    return ctx.getSessionUser().id;
  }

  private persistLogin(ctx: ResolverCtx, user: User) {
    ctx.setSessionUser(this.authService.toSessionUser(user));
  }

  private persistLogout(ctx: ResolverCtx) {
    ctx.setSessionUser(this.authService.toSessionUser(null));
  }
}
