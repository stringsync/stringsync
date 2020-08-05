import { NotationConnectionObject } from './NotationConnectionObject';
import { Connection, AuthRequirement } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationService } from '@stringsync/services';
import { inject, injectable } from 'inversify';
import { Args, Query, Resolver, Arg, UseMiddleware, Mutation, Ctx } from 'type-graphql';
import { ConnectionArgs } from './../Paging';
import { NotationObject } from '.';
import { WithAuthRequirement } from '../../middlewares';
import { CreateNotationInput } from './CreateNotationInput';
import { NotationArgs } from './NotationArgs';
import { ResolverCtx } from '../../types';

@Resolver()
@injectable()
export class NotationResolver {
  notationService: NotationService;

  constructor(@inject(TYPES.NotationService) notationService: NotationService) {
    this.notationService = notationService;
  }

  @Query((returns) => NotationConnectionObject)
  async notations(@Args() args: ConnectionArgs): Promise<Connection<Notation>> {
    return await this.notationService.findPage(args);
  }

  @Query((returns) => NotationObject, { nullable: true })
  async notation(@Args() args: NotationArgs): Promise<Notation | null> {
    return await this.notationService.find(args.id);
  }

  @Mutation((returns) => NotationObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))
  async createNotation(@Arg('input') input: CreateNotationInput, @Ctx() ctx: ResolverCtx): Promise<Notation> {
    return await this.notationService.create(input.songName, input.artistName, ctx.req.session.user.id);
  }
}
