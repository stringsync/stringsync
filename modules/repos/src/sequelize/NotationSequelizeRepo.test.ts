import { User } from '@stringsync/domain';
import { UserRepo, UserSequelizeRepo } from '@stringsync/repos';
import { NotationSequelizeRepo } from './NotationSequelizeRepo';
import { randStr, buildRandNotation, buildRandUser } from '@stringsync/common';
import { NotationModel, UserModel } from '@stringsync/sequelize';
import { NotationRepo } from './../types';
import { useTestContainer, TYPES } from '@stringsync/container';
import { sortBy, isPlainObject } from 'lodash';

const container = useTestContainer();

let notationModel: typeof NotationModel;
let notationRepo: NotationRepo;

let userModel: typeof UserModel;
let userRepo: UserRepo;
let user: User;
let transcriberId: string;

beforeEach(async () => {
  notationModel = container.get<typeof NotationModel>(TYPES.NotationModel);
  notationRepo = new NotationSequelizeRepo(notationModel);

  userModel = container.get<typeof UserModel>(TYPES.UserModel);
  userRepo = new UserSequelizeRepo(userModel);
  user = await userRepo.create(buildRandUser());
  transcriberId = user.id;
});

describe('count', () => {
  it('counts the number of notations', async () => {
    await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
    ]);
    const count = await notationRepo.count();
    expect(count).toBe(3);
  });
});

describe('find', () => {
  it('finds notations', async () => {
    const { id } = await notationRepo.create(buildRandNotation({ transcriberId }));
    const notation = await notationRepo.find(id);
    expect(notation).not.toBeNull();
  });

  it('returns null if notation is missing', async () => {
    const notation = await notationRepo.find(randStr(8));
    expect(notation).toBeNull();
  });

  it('returns a plain object', async () => {
    const { id } = await notationRepo.create(buildRandNotation({ transcriberId }));
    const notation = await notationRepo.find(id);
    expect(isPlainObject(notation)).toBe(true);
  });
});

describe('findAll', () => {
  it('finds all notations', async () => {
    const notations = await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
    ]);
    const foundNotations = await notationRepo.findAll();
    expect(sortBy(foundNotations, 'id')).toStrictEqual(sortBy(notations, 'id'));
  });

  it('returns plain objects', async () => {
    const notations = await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
    ]);
    const foundNotations = await notationRepo.findAll();
    expect(foundNotations.every(isPlainObject)).toBe(true);
  });
});

describe('create', () => {
  it('creates a notation', async () => {
    const beforeCount = await notationRepo.count();
    await notationRepo.create(buildRandNotation({ transcriberId }));
    const afterCount = await notationRepo.count();
    expect(afterCount).toBe(beforeCount + 1);
  });

  it('creates a queryable notation', async () => {
    const notation = await notationRepo.create(buildRandNotation({ transcriberId }));
    const foundNotation = await notationRepo.find(notation.id);
    expect(foundNotation).toStrictEqual(notation);
  });

  it('returns a plain object', async () => {
    const notation = await notationRepo.create(buildRandNotation({ transcriberId }));
    const foundNotation = await notationRepo.find(notation.id);
    expect(isPlainObject(foundNotation)).toBe(true);
  });
});

describe('bulkCreate', () => {
  it('creates many notations', async () => {
    const notations = await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
    ]);
    const foundNotations = await notationRepo.findAll();
    expect(sortBy(foundNotations, 'id')).toStrictEqual(sortBy(notations, 'id'));
  });

  it('returns plain objects', async () => {
    const notations = await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
      buildRandNotation({ transcriberId }),
    ]);
    expect(notations.every(isPlainObject)).toBe(true);
  });
});

describe('update', () => {
  it('updates a notation', async () => {
    const notation = await notationRepo.create(buildRandNotation({ transcriberId }));
    const songName = randStr(8);

    await notationRepo.update(notation.id, { songName });
    const foundNotation = await notationRepo.find(notation.id);

    expect(foundNotation).not.toBeNull();
    expect(foundNotation!.songName).toBe(songName);
  });
});
