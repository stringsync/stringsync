import { times } from 'lodash';
import { Notation, NotationTag, Tag, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { NotationRepo, NotationTagRepo, TagRepo, UserRepo } from '../repos';
import { rand } from '../util';

export const createRandUser = async (attrs: Partial<User> = {}): Promise<User> => {
  const userRepo = container.get<UserRepo>(TYPES.UserRepo);
  return await userRepo.create(rand.user({ ...attrs, cursor: undefined }));
};

export const createRandNotation = async (attrs: Partial<Notation> = {}): Promise<Notation> => {
  const transcriberId = attrs.transcriberId || (await createRandUser()).id;
  const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
  return await notationRepo.create(rand.notation({ ...attrs, transcriberId, cursor: undefined }));
};

export const createRandTag = async (attrs: Partial<Tag> = {}): Promise<Tag> => {
  const tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  return await tagRepo.create(rand.tag({ ...attrs }));
};

export const createRandNotationTag = async (attrs: Partial<NotationTag> = {}): Promise<NotationTag> => {
  const tagId = attrs.tagId || (await createRandTag()).id;
  const notationId = attrs.notationId || (await createRandNotation()).id;
  const notationTagRepo = container.get<NotationTagRepo>(TYPES.NotationTagRepo);
  return await notationTagRepo.create(rand.notationTag({ ...attrs, tagId, notationId }));
};

export const createRandUsers = async (num: number): Promise<User[]> => {
  const userRepo = container.get<UserRepo>(TYPES.UserRepo);
  return await userRepo.bulkCreate(times(num, () => rand.user({ cursor: undefined })));
};

export const createRandNotations = async (num: number): Promise<Notation[]> => {
  const transcribers = await createRandUsers(num);
  const notations = times(num, (ndx) => rand.notation({ transcriberId: transcribers[ndx].id, cursor: undefined }));
  const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
  return await notationRepo.bulkCreate(notations);
};

export const createRandNotationTags = async (num: number): Promise<NotationTag[]> => {
  const [tags, notations] = await Promise.all([createRandTags(num), createRandNotations(num)]);
  const notationTagRepo = container.get<NotationTagRepo>(TYPES.NotationTagRepo);
  return await notationTagRepo.bulkCreate(
    times(num, (ndx) => rand.notationTag({ tagId: tags[ndx].id, notationId: notations[ndx].id }))
  );
};

export const createRandTags = async (num: number): Promise<Tag[]> => {
  const tagRepo = container.get<TagRepo>(TYPES.TagRepo);
  return await tagRepo.bulkCreate(times(num, () => rand.tag()));
};
