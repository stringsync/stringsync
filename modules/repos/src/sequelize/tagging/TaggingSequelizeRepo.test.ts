import { TYPES, useTestContainer } from '@stringsync/container';
import { Notation, User, Tag, Tagging } from '@stringsync/domain';
import { NotationSequelizeRepo } from '../notation';
import { TagSequelizeRepo } from '../tag';
import { UserSequelizeRepo } from '../user';
import { TaggingSequelizeRepo } from './TaggingSequelizeRepo';

const container = useTestContainer();

let userRepo: UserSequelizeRepo;
let user1: User;
let user2: User;

let notationRepo: NotationSequelizeRepo;
let notation1: Notation;
let notation2: Notation;

let tagRepo: TagSequelizeRepo;
let tag1: Tag;
let tag2: Tag;

let taggingRepo: TaggingSequelizeRepo;
let tagging1: Tagging;
let tagging2: Tagging;

beforeEach(() => {
  userRepo = container.get<UserSequelizeRepo>(TYPES.UserSequelizeRepo);
  notationRepo = container.get<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo);
  taggingRepo = container.get<TaggingSequelizeRepo>(TYPES.TaggingSequelizeRepo);
});

it.todo('works');
