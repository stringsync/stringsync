import { AuthRequirement, Connection, randInt } from '@stringsync/common';
import { Logger, TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationService, UploaderService } from '@stringsync/services';
import { createWriteStream } from 'fs';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { inject, injectable } from 'inversify';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { NotationObject } from '.';
import { WithAuthRequirement } from '../../middlewares';
import { ResolverCtx } from '../../types';
import { CreateNotationInput } from './CreateNotationInput';
import { NotationArgs } from './NotationArgs';
import { NotationConnectionArgs } from './NotationConnectionArgs';
import { NotationConnectionObject } from './NotationConnectionObject';

@Resolver()
@injectable()
export class NotationResolver {
  notationService: NotationService;
  uploaderService: UploaderService;
  logger: Logger;

  constructor(
    @inject(TYPES.NotationService) notationService: NotationService,
    @inject(TYPES.UploaderService) uploaderService: UploaderService,
    @inject(TYPES.Logger) logger: Logger
  ) {
    this.notationService = notationService;
    this.uploaderService = uploaderService;
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
  async createNotation(@Arg('input') input: CreateNotationInput, @Ctx() ctx: ResolverCtx): Promise<Notation> {
    return await this.notationService.create(input.songName, input.artistName, ctx.req.session.user.id);
  }

  @Mutation((returns) => Boolean)
  async uploadMedia(@Arg('file', (type) => GraphQLUpload) file: FileUpload, @Ctx() ctx: ResolverCtx): Promise<boolean> {
    const filename = `${ctx.reqAt.getTime()}-${file.filename}`;
    const readStream = file.createReadStream();
    try {
      await this.uploaderService.upload(filename, readStream);
      return true;
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

  @Mutation((returns) => Boolean)
  async multiUploadMedia(
    @Arg('files', (type) => [GraphQLUpload]) files: FileUpload[],
    @Ctx() ctx: ResolverCtx
  ): Promise<boolean> {
    const f = await Promise.all(files);
    await Promise.all(
      f.map((file) => {
        const filename = `${ctx.reqAt.getTime()}-${randInt(10000, 99999)}-${file.filename}`;
        const readStream = file.createReadStream();
        return this.uploaderService.upload(filename, readStream);
      })
    );
    return true;
  }
}
