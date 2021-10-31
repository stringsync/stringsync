import { inject, injectable } from 'inversify';
import { isBoolean, isNumber } from 'lodash';
import path from 'path';
import { Config } from '../../config';
import { Notation } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationRepo } from '../../repos';
import { BlobStorage, Connection, Logger, NotationConnectionArgs } from '../../util';
import { NotationTagService } from '../NotationTag';
import { VideoInfoService } from '../VideoInfo/types';
import { CreateArgs, UpdateArgs } from './types';

@injectable()
export class NotationService {
  constructor(
    @inject(TYPES.NotationTagService) public notationTagService: NotationTagService,
    @inject(TYPES.Config) public config: Config,
    @inject(TYPES.NotationRepo) public notationRepo: NotationRepo,
    @inject(TYPES.BlobStorage) public blobStorage: BlobStorage,
    @inject(TYPES.VideoInfoService) public videoInfoService: VideoInfoService,
    @inject(TYPES.Logger) public logger: Logger
  ) {}

  async find(id: string): Promise<Notation | null> {
    return await this.notationRepo.find(id);
  }

  async findAllByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationRepo.findAllByTranscriberId(transcriberId);
  }

  async findAllByTagId(tagId: string): Promise<Notation[]> {
    return await this.notationRepo.findAllByTagId(tagId);
  }

  async findPage(args: NotationConnectionArgs): Promise<Connection<Notation>> {
    return await this.notationRepo.findPage(args);
  }

  async findSuggestions(id: string, limit: number): Promise<Notation[]> {
    const notation = await this.notationRepo.find(id);
    if (notation) {
      return await this.notationRepo.findSuggestions(notation, limit);
    } else {
      // We always want to suggest something, even if the id corresponds to
      // a notation that doesn't exist.
      const connection = await this.findPage({ last: limit });
      return connection.edges.map((edge) => edge.node);
    }
  }

  async findByVideoFilename(filename: string): Promise<Notation | null> {
    const ext = path.extname(filename);
    const id = path.basename(filename, ext);
    return await this.find(id);
  }

  async create(args: CreateArgs): Promise<Notation> {
    const { artistName, songName, tagIds, transcriberId, thumbnail, video } = args;

    const notation = await this.notationRepo.create({ artistName, songName, transcriberId });

    const thumbnailFilepath = this.getThumbnailFilepath(thumbnail.filename, notation.id);
    const videoFilepath = this.getVideoFilepath(video.filename, notation.id);
    const notationTags = tagIds.map((tagId) => ({ notationId: notation.id, tagId }));

    // There seems to be an issue when creating multiple read streams, so we do this separate
    // from the blob upload.
    const durationMs = await this.videoInfoService.getDurationMs(video.createReadStream());
    notation.durationMs = durationMs;

    const [thumbnailKey] = await Promise.all([
      this.blobStorage.put(thumbnailFilepath, this.config.MEDIA_S3_BUCKET, thumbnail.createReadStream()),
      this.blobStorage.put(videoFilepath, this.config.VIDEO_SRC_S3_BUCKET, video.createReadStream()),
      this.notationTagService.bulkCreate(notationTags),
    ]);

    notation.thumbnailUrl = this.getMediaUrl(thumbnailKey);
    await this.update(notation.id, notation);

    return notation;
  }

  async update(id: string, args: UpdateArgs): Promise<void> {
    if (Object.keys(args).length === 0) {
      return;
    }

    const attrs: Partial<Notation> = {};

    const promises = new Array<Promise<any>>();
    if (args.thumbnail) {
      const thumbnailFilepath = this.getThumbnailFilepath(args.thumbnail.filename, id);
      promises.push(
        this.blobStorage
          .put(thumbnailFilepath, this.config.MEDIA_S3_BUCKET, args.thumbnail.createReadStream())
          .then((thumbnailKey) => {
            attrs.thumbnailUrl = this.getMediaUrl(thumbnailKey);
          })
      );
    }
    if (args.musicXml) {
      const musicXmlFilepath = this.getMusicXmlFilepath(args.musicXml.filename, id);
      promises.push(
        this.blobStorage
          .put(musicXmlFilepath, this.config.MEDIA_S3_BUCKET, args.musicXml.createReadStream())
          .then((musicXmlKey) => {
            attrs.musicXmlUrl = this.getMediaUrl(musicXmlKey);
          })
      );
    }
    await Promise.all(promises);

    if (args.songName) {
      attrs.songName = args.songName;
    }
    if (args.artistName) {
      attrs.artistName = args.artistName;
    }
    if (isNumber(args.deadTimeMs)) {
      attrs.deadTimeMs = args.deadTimeMs;
    }
    if (args.durationMs) {
      attrs.durationMs = args.durationMs;
    }
    if (isBoolean(args.private)) {
      attrs.private = args.private;
    }

    await this.notationRepo.update(id, attrs);
  }

  private getThumbnailFilepath(originalFilename: string, notationId: string): string {
    const ext = this.getExtName(originalFilename);
    return `notations/thumbnail/${notationId}${ext}`;
  }

  private getVideoFilepath(originalFilename: string, notationId: string): string {
    const ext = this.getExtName(originalFilename);
    return `${notationId}${ext}`;
  }

  private getMusicXmlFilepath(originalFilename: string, notationId: string): string {
    const ext = this.getExtName(originalFilename);
    return `/notations/music_xml/${notationId}${ext}`;
  }

  private getMediaUrl(key: string): string {
    return `https://${this.config.MEDIA_CDN_DOMAIN_NAME}/${key}`;
  }

  private getExtName(originalFilename: string): string {
    return path.extname(originalFilename).toLowerCase();
  }
}
