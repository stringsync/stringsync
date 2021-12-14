import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import * as domain from '../../domain';
import { ltTeacher } from '../../domain';
import * as errors from '../../errors';
import { TYPES } from '../../inversify.constants';
import { NotationService } from '../../services';
import { BlobStorage, Logger } from '../../util';
import * as types from '../graphqlTypes';
import { ResolverCtx } from '../types';

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

  @Query((returns) => types.NotationConnection)
  async notations(@Args() args: types.NotationConnectionArgs): Promise<types.NotationConnection> {
    const connection = await this.notationService.findPage(args);
    return types.NotationConnection.of(connection);
  }

  @Query((returns) => types.Notation, { nullable: true })
  async notation(@Args() args: types.NotationArgs): Promise<types.Notation | null> {
    const notation = await this.notationService.find(args.id);
    return notation ? types.Notation.of(notation) : null;
  }

  @Query((returns) => [types.Notation])
  async suggestedNotations(@Args() args: types.SuggestedNotationsArgs): Promise<types.Notation[]> {
    const notations = await this.notationService.findSuggestions(args.id || null, args.limit);
    return notations.map(types.Notation.of);
  }

  @Mutation((returns) => types.Notation, { nullable: true })
  async createNotation(
    @Arg('input') input: types.CreateNotationInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof types.CreateNotationOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn || ltTeacher(sessionUser.role)) {
      return types.ForbiddenError.of({ message: 'must be logged in as teacher' });
    }

    const { artistName, songName, tagIds } = input;
    const [thumbnail, video] = await Promise.all([input.thumbnail, input.video]);
    try {
      const notation = await this.notationService.create({
        artistName,
        songName,
        tagIds,
        thumbnail,
        video,
        transcriberId: ctx.getSessionUser().id,
      });
      return types.Notation.of(notation);
    } catch (e) {
      if (e instanceof errors.ValidationError) {
        return types.ValidationError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }

  @Mutation((returns) => types.Notation, { nullable: true })
  async updateNotation(
    @Arg('input') input: types.UpdateNotationInput,
    @Ctx() ctx: ResolverCtx
  ): Promise<typeof types.UpdateNotationOutput> {
    const sessionUser = ctx.getSessionUser();
    if (!sessionUser.isLoggedIn || ltTeacher(sessionUser.role)) {
      return types.ForbiddenError.of({ message: 'must be logged in as teacher' });
    }

    const notation = await this.notationService.find(input.id);
    if (!notation) {
      return types.NotFoundError.of({ message: `could not find notation: id=${input.id}` });
    }

    const user = ctx.getSessionUser();
    if (notation.transcriberId !== user.id && user.role !== domain.UserRole.ADMIN) {
      return types.ForbiddenError.of({ message: 'must be logged in as transcriber or admin' });
    }

    const [thumbnail, musicXml] = await Promise.all([
      input.thumbnail || Promise.resolve(undefined),
      input.musicXml || Promise.resolve(undefined),
    ]);

    try {
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
        throw new errors.NotFoundError(`could not find notation: id=${input.id}`);
      }
      return types.Notation.of(updatedNotation);
    } catch (e) {
      this.logger.error(`could not update notation: id=${input.id}, error=${e}`);
      if (e instanceof errors.NotFoundError) {
        return types.NotFoundError.of(e);
      } else if (e instanceof errors.ValidationError) {
        return types.ValidationError.of(e);
      } else if (e instanceof errors.BadRequestError) {
        return types.BadRequestError.of(e);
      } else {
        return types.UnknownError.of(e);
      }
    }
  }
}
