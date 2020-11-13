import { AuthRequirement, Connection } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { Notation } from '@stringsync/domain';
import { NotationService } from '@stringsync/services';
import { BlobStorage, Logger } from '@stringsync/util';
import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { NotationObject } from '.';
import { ReqCtx } from '../../../ctx';
import { WithAuthRequirement } from '../../middlewares';
import { CreateNotationInput } from './CreateNotationInput';
import { NotationArgs } from './NotationArgs';
import { NotationConnectionArgs } from './NotationConnectionArgs';
import { NotationConnectionObject } from './NotationConnectionObject';

@Resolver()
@injectable()
export class NotationResolver {
  notationService: NotationService;
  blobStorage: BlobStorage;
  logger: Logger;

  constructor(
    @inject(TYPES.NotationService) notationService: NotationService,
    @inject(TYPES.BlobStorage) blobStorage: BlobStorage,
    @inject(TYPES.Logger) logger: Logger
  ) {
    this.notationService = notationService;
    this.blobStorage = blobStorage;
    this.logger = logger;
  }

  @Query((returns) => NotationConnectionObject)
  async notations(@Args() args: NotationConnectionArgs): Promise<Connection<Notation>> {
    return await this.notationService.findPage(args);
  }

  @Query((returns) => NotationObject, { nullable: true })
  async notation(@Args() args: NotationArgs): Promise<Notation | null> {
    return await this.notationService.find(args.id);
  }

  @Mutation((returns) => NotationObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))
  async createNotation(@Arg('input') input: CreateNotationInput, @Ctx() ctx: ReqCtx): Promise<Notation> {
    const { artistName, songName, tagIds } = input;
    const [thumbnail, video] = await Promise.all([input.thumbnail!, input.video!]);
    return await this.notationService.create({
      artistName,
      songName,
      tagIds,
      thumbnail,
      video,
      transcriberId: ctx.req.session.user.id,
    });
  }
}
