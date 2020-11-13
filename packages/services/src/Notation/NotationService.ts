import { Connection, NotationConnectionArgs } from '@stringsync/common';
import { ContainerConfig } from '@stringsync/config';
import { Db } from '@stringsync/db';
import { TYPES } from '@stringsync/di';
import { Notation } from '@stringsync/domain';
import { NotationRepo } from '@stringsync/repos';
import { BlobStorage } from '@stringsync/util';
import { inject, injectable } from 'inversify';
import path from 'path';
import { TaggingService } from '../Tagging';
import { CreateArgs } from './types';

@injectable()
export class NotationService {
  db: Db;
  taggingService: TaggingService;
  notationRepo: NotationRepo;
  blobStorage: BlobStorage;
  config: ContainerConfig;

  constructor(
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.TaggingService) taggingService: TaggingService,
    @inject(TYPES.NotationRepo) notationRepo: NotationRepo,
    @inject(TYPES.BlobStorage) blobStorage: BlobStorage,
    @inject(TYPES.ContainerConfig) config: ContainerConfig
  ) {
    this.db = db;
    this.taggingService = taggingService;
    this.notationRepo = notationRepo;
    this.blobStorage = blobStorage;
    this.config = config;
  }

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

    const [thumbnailUrl] = await Promise.all([
      this.blobStorage.put(thumbnailFilepath, this.config.S3_BUCKET, thumbnail.createReadStream()),
      this.blobStorage.put(videoFilepath, this.config.S3_VIDEO_SRC_BUCKET, video.createReadStream()),
      this.taggingService.bulkCreate(taggings),
    ]);

    notation.thumbnailUrl = thumbnailUrl;
    await this.update(notation.id, notation);

    return notation;
  }

  async update(id: string, attrs: Partial<Notation>): Promise<void> {
    await this.notationRepo.update(id, attrs);
  }

  private getThumbnailFilepath(originalFilename: string, notation: Notation): string {
    const ext = path.extname(originalFilename);
    return `notations/thumbnail/${notation.id}${ext}`;
  }

  private getVideoFilepath(originalFilename: string, notation: Notation): string {
    const ext = path.extname(originalFilename);
    return `${notation.id}${ext}`;
  }
}
