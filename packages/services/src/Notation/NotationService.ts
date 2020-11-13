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

  async create(args: CreateArgs): Promise<Notation> {
    const { artistName, songName, tagIds, transcriberId, thumbnail, video } = args;

    const thumbnailExt = path.extname(thumbnail.filename);
    const videoExt = path.extname(video.filename);

    const notation = await this.notationRepo.create({ artistName, songName, transcriberId });

    const thumbnailFilepath = `notations/thumbnail/${notation.id}${thumbnailExt}`;
    const videoFilepath = `${notation.id}${videoExt}`;

    const taggings = tagIds.map((tagId) => ({ notationId: notation.id, tagId }));

    const [thumbnailUrl] = await Promise.all([
      this.blobStorage.put(thumbnailFilepath, this.config.S3_BUCKET, thumbnail.createReadStream()),
      // Putting in this bucket kicks off an external process to process the video. The UpdateVideoUrlJob will
      // take care of associating the video URL with the notation.
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
}
