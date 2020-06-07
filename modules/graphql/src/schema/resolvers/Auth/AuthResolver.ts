import { Resolver, Query, Ctx } from 'type-graphql';
import { injectable, inject } from 'inversify';
import { AuthService } from '@stringsync/services';
import { TYPES } from '@stringsync/container';
import * as domain from '@stringsync/domain';
import { ResolverCtx } from '../../types';
import { User } from '../User';

@Resolver()
@injectable()
export class AuthResolver {
  readonly authService: AuthService;

  constructor(@inject(TYPES.AuthService) authService: AuthService) {
    this.authService = authService;
  }

  @Query((returns) => User, { nullable: true })
  async whoami(@Ctx() ctx: ResolverCtx): Promise<domain.User | null> {
    const id = ctx.req.session.id;
    return await this.authService.whoami(id);
  }
}
