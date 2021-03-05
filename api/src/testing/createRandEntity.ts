import { times } from 'lodash';
import { Notation, Tag, Tagging, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../repos';
import { buildRandNotation, buildRandTag, buildRandTagging, buildRandUser } from './buildRandEntity';

export const createRandUser = async (attrs: Partial<User> = {}): Promise<User> => {
  const userRepo = container.get<UserRepo>(TYPES.UserRepo);
  return await userRepo.create(buildRandUser({ ...attrs }));
};

export const createRandNotation = async (attrs: Partial<Notation> = {}): Promise<Notation> => {
  const transcriberId = attrs.transcriberId || (await createRandUser()).id;
  const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
  return await notationRepo.create(buildRandNotation({ ...attrs, transcriberId }));
};

export const createRandTag = async (attrs: Partial<Tag> = {}): Promise<Tag> => {
  const tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  return await tagRepo.create(buildRandTag({ ...attrs }));
};

export const createRandTagging = async (attrs: Partial<Tagging> = {}): Promise<Tagging> => {
  const tagId = attrs.tagId || (await createRandTag()).id;
  const notationId = attrs.notationId || (await createRandNotation()).id;
  const taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
  return await taggingRepo.create(buildRandTagging({ ...attrs, tagId, notationId }));
};

export const createRandUsers = async (num: number): Promise<User[]> => {
  const userRepo = container.get<UserRepo>(TYPES.UserRepo);
  return await userRepo.bulkCreate(times(num, () => buildRandUser()));
};

export const createRandNotations = async (num: number): Promise<Notation[]> => {
  const transcribers = await createRandUsers(num);
  const notations = times(num, (ndx) => buildRandNotation({ transcriberId: transcribers[ndx].id }));
  const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
  return await notationRepo.bulkCreate(notations);
};

export const createRandTaggings = async (num: number): Promise<Tagging[]> => {
  const [tags, notations] = await Promise.all([createRandTags(num), createRandNotations(num)]);
  const taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
  return await taggingRepo.bulkCreate(
    times(num, (ndx) => buildRandTagging({ tagId: tags[ndx].id, notationId: notations[ndx].id }))
  );
};

export const createRandTags = async (num: number): Promise<Tag[]> => {
  const tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  return await tagRepo.bulkCreate(times(num, () => buildRandTag()));
};
