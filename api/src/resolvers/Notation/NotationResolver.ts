import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { NotationObject } from '.';
import { Notation } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { AuthRequirement, NotationService } from '../../services';
import { BlobStorage, Connection, Logger } from '../../util';
import { WithAuthRequirement } from '../middlewares';
import { ResolverCtx } from '../types';
import { CreateNotationInput } from './CreateNotationInput';
import { NotationArgs } from './NotationArgs';
import { NotationConnectionArgs } from './NotationConnectionArgs';
import { NotationConnectionObject } from './NotationConnectionObject';
import { SuggestedNotationsArgs } from './SuggestedNotationsArgs';

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return await this.notationService.find(args.id);
  }

  @Query((returns) => [NotationObject])
  async suggestedNotations(@Args() args: SuggestedNotationsArgs): Promise<Notation[]> {
    return await this.notationService.findSuggestions(args.id, args.limit);
  }

  @Mutation((returns) => NotationObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))
  async createNotation(@Arg('input') input: CreateNotationInput, @Ctx() ctx: ResolverCtx): Promise<Notation> {
    const { artistName, songName, tagIds } = input;
    const [thumbnail, video] = await Promise.all([input.thumbnail!, input.video!]);
    return await this.notationService.create({
      artistName,
      songName,
      tagIds,
      thumbnail,
      video,
      transcriberId: ctx.getSessionUser().id,
    });
  }
}
