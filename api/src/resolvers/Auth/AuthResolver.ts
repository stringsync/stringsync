import { inject, injectable } from 'inversify';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { User } from '../../domain';
import * as errors from '../../errors';
import { TYPES } from '../../inversify.constants';
import { SendMail } from '../../jobs';
import { AuthService, MailWriterService } from '../../services';
import { Logger } from '../../util';
import * as types from '../graphqlTypes';
import { ResolverCtx } from '../types';

@Resolver()
@injectable()
export class AuthResolver {
  constructor(
    @inject(TYPES.Logger) public logger: Logger,
    @inject(TYPES.AuthService) public authService: AuthService,
    @inject(TYPES.MailWriterService) public mailWriterService: MailWriterService,
    @inject(TYPES.SendMail) public sendMail: SendMail
  ) {}

  @Query((returns) => types.User, { nullable: true })
  async whoami(@Ctx() ctx: ResolverCtx): Promise<types.User | null> {
    const id = ctx.getSessionUser().id;
    const user = await this.authService.whoami(id);
    return user ? types.User.of(user) : null;
  }

  @Mutation((returns) => types.LoginOutput)
  async login(@Arg('input') input: types.LoginInput, @Ctx() ctx: ResolverCtx): Promise<typeof types.LoginOutput> {
    const sessionUser = ctx.getSessionUser();
    if (sessionUser.isLoggedIn) {
      return types.ForbiddenError.of({ message: 'must be logged out' });
    }

    const user = await this.authService.getAuthenticatedUser(input.usernameOrEmail, input.password);
    if (!user) {
      return types.ForbiddenError.of({ message: 'wrong username, email, or password' });
    }

    this.persistLogin(ctx, user);
    return types.User.of(user);
  }

  @Mutation((returns) => types.LogoutOutput)
  async logout(@Ctx() ctx: ResolverCtx): Promise<typeof types.LogoutOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn) {
      return types.ForbiddenError.of({ message: 'must be logged in' });
    }
    this.persistLogout(ctx);
    return types.Processed.now();
  }

  @Mutation((returns) => types.SignupOutput)
  async signup(@Arg('input') input: types.SignupInput, @Ctx() ctx: ResolverCtx): Promise<typeof types.SignupOutput> {
    const sessionUser = ctx.getSessionUser();
    if (sessionUser.isLoggedIn) {
      return types.ForbiddenError.of({ message: 'must be logged out' });
    }

    try {
      const user = await this.authService.signup(input.username, input.email, input.password);
      const mail = this.mailWriterService.writeConfirmationEmail(user);
      await this.sendMail.job.enqueue({ mail });
      this.persistLogin(ctx, user);
      return types.User.of(user);
    } catch (e) {
      this.logger.error(`could not signup: error=${e}`);
      if (e instanceof errors.ValidationError) {
        return types.ValidationError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  @Mutation((returns) => types.ConfirmEmailOutput)
  async confirmEmail(
    @Arg('input') input: types.ConfirmEmailInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof types.ConfirmEmailOutput> {
    const sessionUser = ctx.getSessionUser();
    const confirmedAt = ctx.getReqAt();

    if (!sessionUser.isLoggedIn) {
      return types.ForbiddenError.of({ message: 'must be logged in' });
    }
    try {
      await this.authService.confirmEmail(sessionUser.id, input.confirmationToken, confirmedAt);
      return types.EmailConfirmation.of(confirmedAt);
    } catch (e) {
      this.logger.error(`could not confirm email: error=${e}`);
      if (e instanceof errors.NotFoundError) {
        return types.NotFoundError.of(e);
      } else if (e instanceof errors.BadRequestError) {
        return types.BadRequestError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  @Mutation((returns) => types.ResendConfirmationEmailOutput)
  async resendConfirmationEmail(@Ctx() ctx: ResolverCtx): Promise<typeof types.ResendConfirmationEmailOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn) {
      return types.ForbiddenError.of({ message: 'must be logged in' });
    }

    const id = sessionUser.id;
    try {
      const user = await this.authService.resetConfirmationToken(id);
      if (user) {
        const mail = this.mailWriterService.writeConfirmationEmail(user);
        await this.sendMail.job.enqueue({ mail });
      } else {
        throw new errors.NotFoundError(`could not find user: id=${id}`);
      }
    } catch (e) {
      this.logger.error(`could not resend confirmation email: id=${id}, error=${e}`);
    }

    return types.Processed.now();
  }

  @Mutation((returns) => types.Processed)
  async sendResetPasswordEmail(
    @Ctx() ctx: ResolverCtx,
    @Arg('input') input: types.SendResetPasswordEmailInput
  ): Promise<types.Processed> {
    const email = input.email;
    try {
      const user = await this.authService.refreshResetPasswordToken(email, ctx.getReqAt());
      const mail = this.mailWriterService.writeResetPasswordEmail(user);
      await this.sendMail.job.enqueue({ mail });
    } catch (e) {
      this.logger.error(`could not resend reset password email: email=${email}, error=${e}`);
    }

    return types.Processed.now();
  }

  @Mutation((returns) => types.ResetPasswordOutput)
  async resetPassword(
    @Ctx() ctx: ResolverCtx,
    @Arg('input') input: types.ResetPasswordInput
  ): Promise<typeof types.ResetPasswordOutput> {
    try {
      await this.authService.resetPassword(input.email, input.resetPasswordToken, input.password, ctx.getReqAt());
      return types.Processed.now();
    } catch (e) {
      if (e instanceof errors.BadRequestError) {
        return types.BadRequestError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  private persistLogin(ctx: ResolverCtx, user: User) {
    ctx.setSessionUser(this.authService.toSessionUser(user));
  }

  private persistLogout(ctx: ResolverCtx) {
    ctx.setSessionUser(this.authService.toSessionUser(null));
  }
}
