import { randInt, randStr } from '@stringsync/common';
import { Notation, Tag, Tagging, User, UserRole } from '@stringsync/domain';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../types';
import { inject, injectable } from 'inversify';
import { TYPES } from '@stringsync/di';
import { times } from 'lodash';

@injectable()
export class Factory {
  userRepo: UserRepo;
  notationRepo: NotationRepo;
  taggingRepo: TaggingRepo;
  tagRepo: TagRepo;

  constructor(
    @inject(TYPES.UserRepo) userRepo: UserRepo,
    @inject(TYPES.NotationRepo) notationRepo: NotationRepo,
    @inject(TYPES.TaggingRepo) taggingRepo: TaggingRepo,
    @inject(TYPES.TagRepo) tagRepo: TagRepo
  ) {
    this.userRepo = userRepo;
    this.notationRepo = notationRepo;
    this.taggingRepo = taggingRepo;
    this.tagRepo = tagRepo;
  }

  buildRandUser(attrs: Partial<User> = {}): User {
    const now = new Date();

    return {
      id: randStr(8),
      username: randStr(8),
      email: `${randStr(8)}@${randStr(5)}.com`,
      createdAt: now,
      updatedAt: now,
      role: UserRole.STUDENT,
      avatarUrl: null,
      confirmationToken: null,
      confirmedAt: null,
      encryptedPassword: '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe', // password = 'password',
      resetPasswordToken: null,
      resetPasswordTokenSentAt: null,
      rank: randInt(0, 100000),
      ...attrs,
    };
  }

  buildRandNotation(attrs: Partial<Notation> = {}): Notation {
    const now = new Date();

    return {
      id: randStr(8),
      artistName: randStr(8),
      createdAt: now,
      updatedAt: now,
      deadTimeMs: 0,
      durationMs: 1,
      featured: true,
      songName: randStr(8),
      transcriberId: randStr(8),
      cursor: randInt(0, 100000),
      thumbnailUrl: null,
      videoUrl: null,
      ...attrs,
    };
  }

  buildRandTag(attrs: Partial<Tag> = {}): Tag {
    return {
      id: randStr(8),
      name: randStr(8),
      ...attrs,
    };
  }

  buildRandTagging(attrs: Partial<Tagging> = {}): Tagging {
    return {
      id: randStr(8),
      notationId: randStr(8),
      tagId: randStr(8),
      ...attrs,
    };
  }

  async createRandUser(attrs: Partial<User> = {}): Promise<User> {
    return await this.userRepo.create(this.buildRandUser({ ...attrs }));
  }

  async createRandNotation(attrs: Partial<Notation> = {}): Promise<Notation> {
    const transcriberId = attrs.transcriberId || (await this.createRandUser()).id;
    return await this.notationRepo.create(this.buildRandNotation({ ...attrs, transcriberId }));
  }

  async createRandTag(attrs: Partial<Tag> = {}): Promise<Tag> {
    return await this.tagRepo.create(this.buildRandTag({ ...attrs }));
  }

  async createRandTagging(attrs: Partial<Tagging> = {}): Promise<Tagging> {
    const tagId = attrs.tagId || (await this.createRandTag()).id;
    const notationId = attrs.notationId || (await this.createRandNotation()).id;
    return await this.taggingRepo.create(this.buildRandTagging({ ...attrs, tagId, notationId }));
  }

  async createRandUsers(num: number): Promise<User[]> {
    return await this.userRepo.bulkCreate(times(num, () => this.buildRandUser()));
  }

  async createRandNotations(num: number): Promise<Notation[]> {
    const transcribers = await this.createRandUsers(num);
    const notations = times(num, (ndx) => this.buildRandNotation({ transcriberId: transcribers[ndx].id }));
    return await this.notationRepo.bulkCreate(notations);
  }

  async createRandTaggings(num: number): Promise<Tagging[]> {
    const [tags, notations] = await Promise.all([this.createRandTags(num), this.createRandNotations(num)]);
    return await this.taggingRepo.bulkCreate(
      times(num, (ndx) => this.buildRandTagging({ tagId: tags[ndx].id, notationId: notations[ndx].id }))
    );
  }

  async createRandTags(num: number): Promise<Tag[]> {
    return await this.tagRepo.bulkCreate(times(num, () => this.buildRandTag()));
  }
}
