import { inject, injectable } from 'inversify';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from '../../domain';
import * as errors from '../../errors';
import { TYPES } from '../../inversify.constants';
import { SendMail } from '../../jobs';
import { AuthRequirement, AuthService, MailWriterService } from '../../services';
import { Logger } from '../../util';
import { BadRequestError, ForbiddenError, NotFoundError, UnknownError } from '../graphqlTypes';
import { WithAuthRequirement } from '../middlewares';
import { ResolverCtx } from '../types';
import { UserObject } from '../User';
import { ConfirmEmailInput } from './ConfirmEmailInput';
import { ConfirmEmailOutput, EmailConfirmation } from './ConfirmEmailOutput';
import { LoginInput } from './LoginInput';
import { ResendConfirmationEmailOutput, ResendConfirmationEmailProcessed } from './ResendConfirmationEmailOutput';
import { ResetPasswordInput } from './ResetPasswordInput';
import { SendResetPasswordEmailInput } from './SendResetPasswordEmailInput';
import { SignupInput } from './SignupInput';

@Resolver()
@injectable()
export class AuthResolver {
  constructor(
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.AuthService) public authService: AuthService,
    @inject(TYPES.MailWriterService) public mailWriterService: MailWriterService,
    @inject(TYPES.SendMail) public sendMail: SendMail
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
      throw new errors.ForbiddenError('wrong username, email, or password');
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

    const mail = this.mailWriterService.writeConfirmationEmail(user);
    await this.sendMail.job.enqueue({ mail });

    this.persistLogin(ctx, user);
    return user;
  }

  @Mutation((returns) => ConfirmEmailOutput)
  async confirmEmail(
    @Arg('input') input: ConfirmEmailInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof ConfirmEmailOutput> {
    const sessionUser = ctx.getSessionUser();
    const confirmedAt = ctx.getReqAt();

    if (!sessionUser.isLoggedIn) {
      return ForbiddenError.of({ message: 'must be logged in' });
    }
    try {
      await this.authService.confirmEmail(sessionUser.id, input.confirmationToken, confirmedAt);
      return EmailConfirmation.of(confirmedAt);
    } catch (e) {
      this.logger.error(`could not confirm email: ${e}`);
      if (e instanceof errors.NotFoundError) {
        return NotFoundError.of(e);
      } else if (e instanceof errors.BadRequestError) {
        return BadRequestError.of(e);
      } else {
        return UnknownError.of(e);
      }
    }
  }

  @Mutation((returns) => Boolean, { nullable: true })
  async resendConfirmationEmail(@Ctx() ctx: ResolverCtx): Promise<typeof ResendConfirmationEmailOutput> {
    const sessionUser = ctx.getSessionUser();
    const id = sessionUser.id;

    if (!sessionUser.isLoggedIn) {
      return ForbiddenError.of({ message: 'must be logged in' });
    }
    try {
      const user = await this.authService.resetConfirmationToken(id);
      if (user) {
        const mail = this.mailWriterService.writeConfirmationEmail(user);
        await this.sendMail.job.enqueue({ mail });
      } else {
        this.logger.warn(`resendConfirmationEmail attempted for userId: ${id}, but didn't find a user`);
      }
      return ResendConfirmationEmailProcessed.of();
    } catch (e) {
      this.logger.error(`resendConfirmationEmail attempted for userId: ${id}, got error ${e}`);
      return UnknownError.of(e);
    }
  }

  @Mutation((returns) => Boolean, { nullable: true })
  async sendResetPasswordEmail(
    @Ctx() ctx: ResolverCtx,
    @Arg('input') input: SendResetPasswordEmailInput
  ): Promise<true> {
    const email = input.email;

    const user = await this.authService.refreshResetPasswordToken(email, ctx.getReqAt());
    const mail = this.mailWriterService.writeResetPasswordEmail(user);
    await this.sendMail.job.enqueue({ mail });

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
