import { inject, injectable } from 'inversify';
import path from 'path';
import { Config } from '../../config';
import { Notation } from '../../domain';
import { TYPES } from '../../inversify.constants';
import { NotationRepo } from '../../repos';
import { BlobStorage, Connection, NotationConnectionArgs } from '../../util';
import { TaggingService } from '../Tagging';
import { CreateArgs } from './types';

@injectable()
export class NotationService {
  constructor(
    @inject(TYPES.TaggingService) public taggingService: TaggingService,
    @inject(TYPES.Config) public config: Config,
    @inject(TYPES.NotationRepo) public notationRepo: NotationRepo,
    @inject(TYPES.BlobStorage) public blobStorage: BlobStorage
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

    const thumbnailFilepath = this.getThumbnailFilepath(thumbnail.filename, notation);
    const videoFilepath = this.getVideoFilepath(video.filename, notation);
    const taggings = tagIds.map((tagId) => ({ notationId: notation.id, tagId }));

    const [thubmanailKey] = await Promise.all([
      this.blobStorage.put(thumbnailFilepath, this.config.MEDIA_S3_BUCKET, thumbnail.createReadStream()),
      this.blobStorage.put(videoFilepath, this.config.VIDEO_SRC_S3_BUCKET, video.createReadStream()),
      this.taggingService.bulkCreate(taggings),
    ]);

    notation.thumbnailUrl = this.getThumbnailUrl(thubmanailKey);
    await this.update(notation.id, notation);

    return notation;
  }

  async update(id: string, attrs: Partial<Notation>): Promise<void> {
    await this.notationRepo.update(id, attrs);
  }

  private getThumbnailFilepath(originalFilename: string, notation: Notation): string {
    const ext = this.getExtName(originalFilename);
    return `notations/thumbnail/${notation.id}${ext}`;
  }

  private getVideoFilepath(originalFilename: string, notation: Notation): string {
    const ext = this.getExtName(originalFilename);
    return `${notation.id}${ext}`;
  }

  private getThumbnailUrl(thumbnailKey: string): string {
    return `https://${this.config.MEDIA_CDN_DOMAIN_NAME}/${thumbnailKey}`;
  }

  private getExtName(originalFilename: string): string {
    return path.extname(originalFilename).toLowerCase();
  }
}
