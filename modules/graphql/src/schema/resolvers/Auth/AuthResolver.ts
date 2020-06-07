import { Resolver, Query, Ctx, Mutation, Arg } from 'type-graphql';
import { injectable, inject } from 'inversify';
import { AuthService } from '@stringsync/services';
import { TYPES } from '@stringsync/container';
import { User } from '@stringsync/domain';
import { ResolverCtx } from '../../types';
import { UserObject } from '../User';
import { LoginInput } from './LoginInput';
import { ForbiddenError } from '@stringsync/common';

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
  async login(@Arg('input') input: LoginInput, @Ctx() ctx: ResolverCtx): Promise<User> {
    const { usernameOrEmail, password } = input;

    const user = await this.authService.getAuthenticatedUser(usernameOrEmail, password);
    if (!user) {
      throw new ForbiddenError('wrong username, email, or password');
    }

    // Persist the session user info between requests.
    ctx.req.session.user = this.authService.toSessionUser(user);

    return user;
  }
}
