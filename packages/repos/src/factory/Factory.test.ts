import { randInt, randStr } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/di';
import { NotationRepo, TaggingRepo, TagRepo, UserRepo } from '../types';
import { Factory } from './Factory';

const container = useTestContainer();

let factory: Factory;

let userRepo: UserRepo;
let notationRepo: NotationRepo;
let taggingRepo: TaggingRepo;
let tagRepo: TagRepo;

beforeEach(async () => {
  factory = container.get<Factory>(TYPES.Factory);

  userRepo = factory.userRepo;
  notationRepo = factory.notationRepo;
  taggingRepo = factory.taggingRepo;
  tagRepo = factory.tagRepo;
});

describe('createRandUser', () => {
  it('can accept attrs', async () => {
    const id = randStr(8);
    const username = randStr(8);

    const user = await factory.createRandUser({ id, username });

    expect(user.id).toBe(id);
    expect(user.username).toBe(username);
  });

  it('persists data', async () => {
    const user = await factory.createRandUser();

    const foundUser = await userRepo.find(user.id);
    expect(foundUser).not.toBeNull();
    expect(foundUser!.id).toBe(user.id);
  });
});

describe('createRandNotation', () => {
  it('can accept attrs', async () => {
    const id = randStr(8);
    const songName = randStr(8);

    const notation = await factory.createRandNotation({ id, songName });

    expect(notation.id).toBe(id);
    expect(notation.songName).toBe(songName);
  });

  it('persists data', async () => {
    const notation = await factory.createRandNotation();

    const foundNotation = await notationRepo.find(notation.id);
    expect(foundNotation).not.toBeNull();
    expect(foundNotation!.id).toBe(notation.id);
  });

  it('creates a transcriber', async () => {
    const notation = await factory.createRandNotation();

    const transcriber = await userRepo.find(notation.transcriberId);
    expect(transcriber).not.toBeNull();
    expect(transcriber!.id).toBe(notation.transcriberId);
  });
});

describe('createRandTag', () => {
  it('can accept attrs', async () => {
    const id = randStr(8);
    const name = randStr(10);

    const tag = await factory.createRandTag({ id, name });

    expect(tag.id).toBe(id);
    expect(tag.name).toBe(name);
  });

  it('persists data', async () => {
    const tag = await factory.createRandTag();

    const foundTag = await tagRepo.find(tag.id);
    expect(foundTag).not.toBeNull();
    expect(foundTag!.id).toBe(tag.id);
  });
});

describe('createRandTagging', () => {
  it('can accept attrs', async () => {
    const id = randStr(8);

    const tagging = await factory.createRandTagging({ id });

    expect(tagging.id).toBe(id);
  });

  it('persists data', async () => {
    const tagging = await factory.createRandTagging();

    const foundTagging = await taggingRepo.find(tagging.id);
    expect(foundTagging).not.toBeNull();
    expect(foundTagging!.id).toBe(tagging.id);
  });

  it('creates a notation', async () => {
    const tagging = await factory.createRandTagging();

    const notation = await notationRepo.find(tagging.notationId);
    expect(notation).not.toBeNull();
    expect(notation!.id).toBe(tagging.notationId);
  });

  it('creates a tag', async () => {
    const tagging = await factory.createRandTagging();

    const tag = await tagRepo.find(tagging.tagId);
    expect(tag).not.toBeNull();
    expect(tag!.id).toBe(tagging.tagId);
  });
});

describe('createRandUsers', () => {
  it('creates num users', async () => {
    const num = randInt(2, 5);

    await factory.createRandUsers(num);

    const userCount = await userRepo.count();
    expect(userCount).toBe(num);
  });
});

describe('createRandNotations', () => {
  it('creates num notations and transcribers', async () => {
    const num = randInt(2, 5);

    await factory.createRandNotations(num);

    const [notationCount, userCount] = await Promise.all([notationRepo.count(), userRepo.count()]);
    expect(notationCount).toBe(num);
    expect(userCount).toBe(num);
  });
});

describe('createRandTags', () => {
  it('creates num tags', async () => {
    const num = randInt(2, 5);

    await factory.createRandTags(num);

    const tagCount = await tagRepo.count();
    expect(tagCount).toBe(num);
  });
});

describe('createRandTaggings', () => {
  it('creates num taggings, notations, and tags', async () => {
    const num = randInt(2, 5);

    await factory.createRandTaggings(num);

    const [taggingCount, notationCount, tagCount] = await Promise.all([
      taggingRepo.count(),
      notationRepo.count(),
      tagRepo.count(),
    ]);

    expect(taggingCount).toBe(num);
    expect(notationCount).toBe(num);
    expect(tagCount).toBe(num);
  });
});
