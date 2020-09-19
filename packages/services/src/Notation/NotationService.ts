import { TYPES } from '@stringsync/di';
import { injectable, inject } from 'inversify';
import { NotationRepo, TagRepo } from '@stringsync/repos';
import { Notation } from '@stringsync/domain';
import { Connection, NotationConnectionArgs } from '@stringsync/common';
import { CreateArgs } from './types';
import { TaggingService } from '../Tagging';
import { Db } from '@stringsync/db';
import path from 'path';
import { FileStorage } from '@stringsync/util';

@injectable()
export class NotationService {
  db: Db;
  taggingService: TaggingService;
  notationRepo: NotationRepo;
  fileStorage: FileStorage;

  constructor(
    @inject(TYPES.Db) db: Db,
    @inject(TYPES.TaggingService) taggingService: TaggingService,
    @inject(TYPES.NotationRepo) notationRepo: NotationRepo,
    @inject(TYPES.FileStorage) fileStorage: FileStorage
  ) {
    this.db = db;
    this.taggingService = taggingService;
    this.notationRepo = notationRepo;
    this.fileStorage = fileStorage;
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
    const videoFilepath = `notations/video/${notation.id}${videoExt}`;

    const taggings = tagIds.map((tagId) => ({ notationId: notation.id, tagId }));

    const [thumbnailUrl, videoUrl] = await Promise.all([
      this.fileStorage.put(thumbnailFilepath, thumbnail.createReadStream()),
      this.fileStorage.put(videoFilepath, video.createReadStream()),
      this.taggingService.bulkCreate(taggings),
    ]);

    notation.thumbnailUrl = thumbnailUrl;
    notation.videoUrl = videoUrl;
    await this.update(notation.id, notation);

    return notation;
  }

  async update(id: string, attrs: Notation): Promise<void> {
    await this.notationRepo.update(id, attrs);
  }
}
