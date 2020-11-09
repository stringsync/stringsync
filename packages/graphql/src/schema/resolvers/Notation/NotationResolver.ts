import { AuthRequirement, Connection } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { Notation } from '@stringsync/domain';
import { NotationService } from '@stringsync/services';
import { FileStorage, Logger } from '@stringsync/util';
import { DynamoDbDocStore } from '@stringsync/util/src/doc-store/DynamoDbDocStore';
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
  fileStorage: FileStorage;
  logger: Logger;

  constructor(
    @inject(TYPES.NotationService) notationService: NotationService,
    @inject(TYPES.FileStorage) fileStorage: FileStorage,
    @inject(TYPES.Logger) logger: Logger
  ) {
    this.notationService = notationService;
    this.fileStorage = fileStorage;
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

  @Query((returns) => String, { nullable: false })
  async test(@Ctx() ctx: ReqCtx): Promise<string> {
    const store = ctx.container.get<DynamoDbDocStore>(TYPES.VideoMetadataStore);
    const metadata = await store.get('266db80e-5ba0-4b08-9c57-d15cb9404435');
    return JSON.stringify(metadata);
  }
}
