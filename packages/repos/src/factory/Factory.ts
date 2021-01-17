import { inject, injectable } from '@stringsync/di';
import { EntityBuilder, Notation, Tag, Tagging, User } from '@stringsync/domain';
import { times } from 'lodash';
import { REPOS_TYPES } from '../REPOS_TYPES';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../types';

const TYPES = { ...REPOS_TYPES };

@injectable()
export class Factory {
  constructor(
    @inject(TYPES.UserRepo) public userRepo: UserRepo,
    @inject(TYPES.NotationRepo) public notationRepo: NotationRepo,
    @inject(TYPES.TaggingRepo) public taggingRepo: TaggingRepo,
    @inject(TYPES.TagRepo) public tagRepo: TagRepo
  ) {}

  async createRandUser(attrs: Partial<User> = {}): Promise<User> {
    return await this.userRepo.create(EntityBuilder.buildRandUser({ ...attrs }));
  }

  async createRandNotation(attrs: Partial<Notation> = {}): Promise<Notation> {
    const transcriberId = attrs.transcriberId || (await this.createRandUser()).id;
    return await this.notationRepo.create(EntityBuilder.buildRandNotation({ ...attrs, transcriberId }));
  }

  async createRandTag(attrs: Partial<Tag> = {}): Promise<Tag> {
    return await this.tagRepo.create(EntityBuilder.buildRandTag({ ...attrs }));
  }

  async createRandTagging(attrs: Partial<Tagging> = {}): Promise<Tagging> {
    const tagId = attrs.tagId || (await this.createRandTag()).id;
    const notationId = attrs.notationId || (await this.createRandNotation()).id;
    return await this.taggingRepo.create(EntityBuilder.buildRandTagging({ ...attrs, tagId, notationId }));
  }

  async createRandUsers(num: number): Promise<User[]> {
    return await this.userRepo.bulkCreate(times(num, () => EntityBuilder.buildRandUser()));
  }

  async createRandNotations(num: number): Promise<Notation[]> {
    const transcribers = await this.createRandUsers(num);
    const notations = times(num, (ndx) => EntityBuilder.buildRandNotation({ transcriberId: transcribers[ndx].id }));
    return await this.notationRepo.bulkCreate(notations);
  }

  async createRandTaggings(num: number): Promise<Tagging[]> {
    const [tags, notations] = await Promise.all([this.createRandTags(num), this.createRandNotations(num)]);
    return await this.taggingRepo.bulkCreate(
      times(num, (ndx) => EntityBuilder.buildRandTagging({ tagId: tags[ndx].id, notationId: notations[ndx].id }))
    );
  }

  async createRandTags(num: number): Promise<Tag[]> {
    return await this.tagRepo.bulkCreate(times(num, () => EntityBuilder.buildRandTag()));
  }
}
