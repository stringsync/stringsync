import { EntityManager } from '@mikro-orm/core';
import { isPlainObject } from 'lodash';
import { Db } from '../db';
import { Notation, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { buildRandNotation, buildRandUser } from '../testing';
import { Ctor, ctor, randStr, util } from '../util';
import { NotationLoader as MikroORMNotationLoader } from './mikro-orm';
import { getEntityManager } from './mikro-orm/getEntityManager';
import { NotationLoader, NotationRepo, UserRepo } from './types';

describe.each([['MikroORMNotationLoader', MikroORMNotationLoader]])('%s', (name, Ctor) => {
  let ORIGINAL_NOTATION_LOADER: Ctor<NotationLoader>;

  let em: EntityManager;
  let notationLoader: NotationLoader;

  let transcriber1: User;
  let transcriber2: User;
  let notation1: Notation;
  let notation2: Notation;
  let notation3: Notation;

  beforeAll(() => {
    ORIGINAL_NOTATION_LOADER = ctor(container.get<NotationLoader>(TYPES.NotationLoader));
    container.rebind<NotationLoader>(TYPES.NotationLoader).to(Ctor);
  });

  beforeEach(async () => {
    const db = container.get<Db>(TYPES.Db);
    em = getEntityManager(db);

    notationLoader = container.get<NotationLoader>(TYPES.NotationLoader);

    const userRepo = container.get<UserRepo>(TYPES.UserRepo);
    const notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

    [transcriber1, transcriber2] = await userRepo.bulkCreate([buildRandUser(), buildRandUser()]);
    [notation1, notation2, notation3] = await notationRepo.bulkCreate([
      buildRandNotation({ transcriberId: transcriber1.id }),
      buildRandNotation({ transcriberId: transcriber1.id }),
      buildRandNotation({ transcriberId: transcriber2.id }),
    ]);
  });

  afterAll(() => {
    container.rebind<NotationLoader>(TYPES.NotationLoader).to(ORIGINAL_NOTATION_LOADER);
  });

  describe('findById', () => {
    it('finds a notation by id', async () => {
      const notation = await notationLoader.findById(notation1.id);
      expect(notation).not.toBeNull();
      expect(notation!.id).toBe(notation1.id);
    });

    it('returns null for missing notations', async () => {
      const notation = await notationLoader.findById(randStr(10));
      expect(notation).toBeNull();
    });

    it('returns a plain object', async () => {
      const notation = await notationLoader.findById(notation1.id);
      expect(isPlainObject(notation)).toBe(true);
    });
  });

  describe('findByTranscriberId', () => {
    it('finds a notation by transcriberId', async () => {
      const notations = await notationLoader.findAllByTranscriberId(transcriber1.id);
      expect(notations.map(util.id)).toIncludeAllMembers([notation1, notation2].map(util.id));
    });

    it('returns an empty array for a missing transcriber', async () => {
      const notations = await notationLoader.findAllByTranscriberId(randStr(10));
      expect(notations).toStrictEqual([]);
    });

    it('returns plain objects', async () => {
      const notations = await notationLoader.findAllByTranscriberId(transcriber1.id);
      expect(notations).toHaveLength(2);
      expect(notations.every(isPlainObject)).toBe(true);
    });
  });
});
