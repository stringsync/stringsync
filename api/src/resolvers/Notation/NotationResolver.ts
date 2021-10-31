import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { NotationObject } from '.';
import { Notation, UserRole } from '../../domain';
import { ForbiddenError, NotFoundError } from '../../errors';
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
import { UpdateNotationInput } from './UpdateNotationInput';

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

  @Mutation((returns) => NotationObject, { nullable: true })
  @UseMiddleware(WithAuthRequirement(AuthRequirement.LOGGED_IN_AS_TEACHER))
  async updateNotation(@Arg('input') input: UpdateNotationInput, @Ctx() ctx: ResolverCtx): Promise<Notation> {
    const notation = await this.notationService.find(input.id);
    if (!notation) {
      throw new NotFoundError(`could not find notation with id: ${input.id}`);
    }

    const user = ctx.getSessionUser();
    if (notation.transcriberId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenError('not permitted to edit notation');
    }

    const [thumbnail, musicXml] = await Promise.all([
      input.thumbnail || Promise.resolve(undefined),
      input.musicXml || Promise.resolve(undefined),
    ]);

    await this.notationService.update(input.id, {
      songName: input.songName,
      artistName: input.artistName,
      deadTimeMs: input.deadTimeMs,
      durationMs: input.durationMs,
      private: input.private,
      thumbnail,
      musicXml,
    });

    const updatedNotation = await this.notationService.find(input.id);
    if (!updatedNotation) {
      throw new NotFoundError(`could not find notation with id: ${input.id}`);
    }

    return updatedNotation;
  }
}
