import { buildRandNotation, buildRandUser } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationRepo, TagRepo, UserRepo } from '../types';

const container = useTestContainer();

let tagRepo: TagRepo;
let notationRepo: NotationRepo;
let userRepo: UserRepo;

let transcriberId: string;
let notation1: Notation;
let notation2: Notation;

beforeEach(async () => {
  tagRepo = container.get<TagRepo>(TYPES.TagSequelizeRepo);
  notationRepo = container.get<NotationRepo>(TYPES.NotationSequelizeRepo);
  userRepo = container.get<UserRepo>(TYPES.UserSequelizeRepo);

  const transcriber = await userRepo.create(buildRandUser());
  transcriberId = transcriber.id;

  [notation1, notation2] = await notationRepo.bulkCreate([
    buildRandNotation({ transcriberId }),
    buildRandNotation({ transcriberId }),
  ]);
});

describe('count', () => {
  it.todo('returns the number of tags');
});
