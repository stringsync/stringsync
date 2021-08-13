import { first, isPlainObject, last, omit, sortBy, take, times } from 'lodash';
import { Db } from '../db';
import { Notation, Tag, User } from '../domain';
import { container } from '../inversify.config';
import { TYPES } from '../inversify.constants';
import { buildRandNotation, buildRandTag, buildRandTagging, buildRandUser } from '../testing';
import { Ctor, ctor, randStr, util } from '../util';
import { NotationRepo as MikroORMNotationRepo, TaggingRepo } from './mikro-orm';
import { NotationRepo, TagRepo, UserRepo } from './types';

describe.each([['MikroORMNotationRepo', MikroORMNotationRepo]])('%s', (name, Ctor) => {
  let ORIGINAL_NOTATION_REPO: Ctor<NotationRepo>;

  let notationRepo: NotationRepo;
  let userRepo: UserRepo;
  let tagRepo: TagRepo;
  let taggingRepo: TaggingRepo;

  let user: User;
  let transcriberId: string;

  beforeAll(() => {
    ORIGINAL_NOTATION_REPO = ctor(container.get<NotationRepo>(TYPES.NotationRepo));
    container.rebind<NotationRepo>(TYPES.NotationRepo).to(Ctor);
  });

  beforeEach(async () => {
    notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);
    userRepo = container.get<UserRepo>(TYPES.UserRepo);
    tagRepo = container.get<TagRepo>(TYPES.TagRepo);
    taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);

    user = await userRepo.create(buildRandUser());
    transcriberId = user.id;
  });

  afterAll(() => {
    container.rebind<NotationRepo>(TYPES.NotationRepo).to(ORIGINAL_NOTATION_REPO);
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

  describe('validate', () => {
    it('permits valid notations', async () => {
      await expect(notationRepo.validate(buildRandNotation())).resolves.not.toThrow();
    });

    it.each(['Above And Beyond (The Call Of Love)', `no i don't shave my thighs`, `You Can't Come with Me`])(
      'permits valid song names',
      async (songName) => {
        await expect(notationRepo.validate(buildRandNotation({ songName }))).resolves.not.toThrow();
      }
    );

    it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
      'disallows invalid song names',
      async (songName) => {
        await expect(notationRepo.validate(buildRandNotation({ songName }))).rejects.toThrow();
      }
    );

    it.each(['@jaredplaysguitar', 'tekashi69'])('permits valid artist names', async (artistName) => {
      await expect(notationRepo.validate(buildRandNotation({ artistName }))).resolves.not.toThrow();
    });

    it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
      'disallows invalid artist names',
      async (artistName) => {
        await expect(notationRepo.validate(buildRandNotation({ artistName }))).rejects.toThrow();
      }
    );
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

      expect(foundNotations.map(util.id)).toIncludeAllMembers(notations.map(util.id));
    });

    it('returns plain objects', async () => {
      await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId }),
        buildRandNotation({ transcriberId }),
        buildRandNotation({ transcriberId }),
      ]);

      const foundNotations = await notationRepo.findAll();

      expect(foundNotations.every(isPlainObject)).toBe(true);
    });
  });

  describe('findByTranscriberId', () => {
    let transcriber1: User;
    let transcriber2: User;

    beforeEach(async () => {
      transcriber1 = user;
      transcriber2 = await userRepo.create(buildRandUser());
    });

    it('finds notations by transcriberId', async () => {
      const [notation1, notation2, notation3] = await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId: transcriber1.id, cursor: 1 }),
        buildRandNotation({ transcriberId: transcriber1.id, cursor: 2 }),
        buildRandNotation({ transcriberId: transcriber2.id, cursor: 3 }),
      ]);

      const foundNotations = await notationRepo.findAllByTranscriberId(transcriber1.id);

      expect(foundNotations).not.toIncludeAnyMembers([notation3]);
      expect(foundNotations).toIncludeAllMembers([notation1, notation2]);
    });

    it('returns an empty array for a missing transcriber', async () => {
      const notations = await notationRepo.findAllByTranscriberId(randStr(10));
      expect(notations).toStrictEqual([]);
    });

    it('returns plain objects', async () => {
      await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId: transcriber1.id }),
        buildRandNotation({ transcriberId: transcriber1.id }),
      ]);

      const foundNotations = await notationRepo.findAllByTranscriberId(transcriber1.id);

      expect(foundNotations).toHaveLength(2);
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

    it('creates a notation without a cursor', async () => {
      const beforeCount = await notationRepo.count();
      await notationRepo.create(buildRandNotation({ transcriberId, cursor: undefined }));
      const afterCount = await notationRepo.count();

      expect(afterCount).toBe(beforeCount + 1);
    });

    it('creates a queryable notation', async () => {
      const notation = await notationRepo.create(buildRandNotation({ transcriberId }));
      const foundNotation = await notationRepo.find(notation.id);

      expect(omit(foundNotation, 'cursor')).toStrictEqual(omit(notation, 'cursor'));
    });

    it('returns a plain object', async () => {
      const notation = await notationRepo.create(buildRandNotation({ transcriberId }));
      const foundNotation = await notationRepo.find(notation.id);

      expect(isPlainObject(foundNotation)).toBe(true);
    });

    it('allows duplicate notations', async () => {
      const notation = buildRandNotation({ id: undefined, cursor: undefined, transcriberId });

      const notation1 = await notationRepo.create(notation);
      const notation2 = await notationRepo.create(notation);

      expect(notation1.id).not.toBe(notation2.id);
    });
  });

  describe('bulkCreate', () => {
    it('creates many notations', async () => {
      const notations = await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId, cursor: 1 }),
        buildRandNotation({ transcriberId, cursor: 2 }),
        buildRandNotation({ transcriberId, cursor: 3 }),
      ]);

      const foundNotations = await notationRepo.findAll();

      expect(foundNotations).toIncludeAllMembers(notations);
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

      const updatedNotation = await notationRepo.update(notation.id, { songName });
      const foundNotation = await notationRepo.find(notation.id);

      expect(updatedNotation.songName).toBe(songName);
      expect(updatedNotation).toStrictEqual(foundNotation);
    });

    it('returns plain objects', async () => {
      const notation = await notationRepo.create(buildRandNotation({ transcriberId }));
      const songName = randStr(8);

      const updatedNotation = await notationRepo.update(notation.id, { songName });

      expect(isPlainObject(updatedNotation)).toBe(true);
    });
  });

  describe('findPage', () => {
    const NUM_USERS = 2;
    const NUM_NOTATIONS = 11;

    let users: User[];
    let notations: Notation[];

    beforeEach(async () => {
      users = new Array(NUM_USERS);
      for (let ndx = 0; ndx < NUM_USERS; ndx++) {
        users[ndx] = buildRandUser({ cursor: ndx + 1 });
      }
      users = await userRepo.bulkCreate(users);

      notations = new Array(NUM_NOTATIONS);
      for (let ndx = 0; ndx < NUM_NOTATIONS; ndx++) {
        const transcriber = ndx % 2 === 0 ? users[0] : users[1];
        notations[ndx] = buildRandNotation({ cursor: ndx + 1, transcriberId: transcriber.id });
      }
      notations = await notationRepo.bulkCreate(notations);
    });

    it('returns the first PAGE_LIMIT records by default', async () => {
      const notationConnection = await notationRepo.findPage({});

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = take(
        sortBy(notations, (notation) => notation.cursor),
        10
      );

      expect(actualNotations).toHaveLength(10);
      expect(actualNotations).toIncludeAllMembers(expectedNotations);
    });

    it('returns the first N records', async () => {
      const notationConnection = await notationRepo.findPage({ first: 5 });

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = take(
        sortBy(notations, (notation) => notation.cursor),
        5
      );

      expect(actualNotations).toHaveLength(5);
      expect(actualNotations).toStrictEqual(expectedNotations);
    });

    it('returns the first N records after a cursor', async () => {
      const { pageInfo } = await notationRepo.findPage({ first: 1 });
      const notationConnection = await notationRepo.findPage({ first: 2, after: pageInfo.endCursor });

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = sortBy(notations, (notation) => notation.cursor).slice(1, 3);

      expect(actualNotations).toHaveLength(2);
      expect(actualNotations).toStrictEqual(expectedNotations);
    });

    it('returns the last N records', async () => {
      const notationConnection = await notationRepo.findPage({ last: 5 });

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = sortBy(notations, (notation) => notation.cursor).slice(NUM_NOTATIONS - 5);

      expect(actualNotations).toHaveLength(5);
      expect(actualNotations).toStrictEqual(expectedNotations);
    });

    it('returns the last N records before a cursor', async () => {
      const { pageInfo } = await notationRepo.findPage({ last: 1 });
      const notationConnection = await notationRepo.findPage({ last: 2, before: pageInfo.startCursor });

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = sortBy(notations, (notation) => notation.cursor).slice(
        NUM_NOTATIONS - 3,
        NUM_NOTATIONS - 1
      );

      expect(actualNotations).toHaveLength(2);
      expect(actualNotations).toStrictEqual(expectedNotations);
    });

    it('returns all records when limit is greater than the records', async () => {
      const limit = NUM_NOTATIONS + 1;
      const notationConnection = await notationRepo.findPage({ first: limit });

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = sortBy(notations, (notation) => notation.cursor);

      expect(actualNotations).toStrictEqual(expectedNotations);
    });

    it('returns all records when limit is greater than remaining records after a cursor', async () => {
      const { pageInfo } = await notationRepo.findPage({ first: 1 });
      const notationConnection = await notationRepo.findPage({ first: NUM_NOTATIONS + 1, after: pageInfo.endCursor });

      const actualNotations = notationConnection.edges.map((edge) => edge.node);
      const expectedNotations = sortBy(notations, (notation) => notation.cursor).slice(1);

      expect(actualNotations).toHaveLength(expectedNotations.length);
      expect(actualNotations).toStrictEqual(expectedNotations);
    });
  });

  describe('findPage', () => {
    let tagRepo: TagRepo;
    let taggingRepo: TaggingRepo;

    beforeEach(async () => {
      tagRepo = container.get<TagRepo>(TYPES.TagRepo);
      taggingRepo = container.get<TaggingRepo>(TYPES.TaggingRepo);
    });

    it('defaults to paging forward', async () => {
      const notations = await notationRepo.bulkCreate(
        times(11, (ndx) => buildRandNotation({ transcriberId, cursor: ndx + 1 }))
      );

      const { edges, pageInfo } = await notationRepo.findPage({});

      expect(edges).toHaveLength(10);
      expect(edges.map((edge) => edge.node)).toStrictEqual(take(notations, 10));
      expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
      expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
      expect(pageInfo.hasNextPage).toBe(true);
      expect(pageInfo.hasPreviousPage).toBe(false);
    });

    it('returns the first N notations', async () => {
      const notations = await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId, cursor: 1 }),
        buildRandNotation({ transcriberId, cursor: 2 }),
      ]);

      const { edges } = await notationRepo.findPage({ first: 1 });

      expect(edges.map((edge) => edge.node)).toStrictEqual(notations.slice(0, 1));
    });

    it('returns the last N notations', async () => {
      const notations = await notationRepo.bulkCreate([
        buildRandNotation({ transcriberId, cursor: 1 }),
        buildRandNotation({ transcriberId, cursor: 2 }),
      ]);

      const { edges } = await notationRepo.findPage({ last: 1 });

      expect(edges.map((edge) => edge.node)).toStrictEqual(notations.slice(-1));
    });

    describe('with search parameters', () => {
      let user1: User;
      let user2: User;
      let user3: User;

      let notation1: Notation;
      let notation2: Notation;
      let notation3: Notation;

      let tag1: Tag;
      let tag2: Tag;
      let tag3: Tag;

      beforeEach(async () => {
        [user1, user2, user3] = await userRepo.bulkCreate([
          buildRandUser({ username: 'foo' }),
          buildRandUser({ username: 'bar' }),
          buildRandUser({ username: 'foobar' }),
        ]);

        [notation1, notation2, notation3] = await notationRepo.bulkCreate([
          buildRandNotation({
            songName: 'yikes',
            artistName: 'bach',
            transcriberId: user1.id,
            cursor: 1,
          }),
          buildRandNotation({
            songName: 'overnight',
            artistName: 'loony',
            transcriberId: user2.id,
            cursor: 2,
          }),
          buildRandNotation({
            songName: 'bull fighter',
            artistName: 'jean dawson',
            transcriberId: user3.id,
            cursor: 3,
          }),
        ]);

        [tag1, tag2, tag3] = await tagRepo.bulkCreate([buildRandTag(), buildRandTag(), buildRandTag()]);

        await taggingRepo.bulkCreate([
          buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
          buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
          buildRandTagging({ notationId: notation2.id, tagId: tag2.id }),
          buildRandTagging({ notationId: notation2.id, tagId: tag3.id }),
        ]);
      });

      it('returns notations that have a transcriber username matching query', async () => {
        const { edges, pageInfo } = await notationRepo.findPage({ first: 3, query: 'foo' });

        expect(edges).toHaveLength(2);
        expect(edges.map((edge) => edge.node)).toStrictEqual([notation1, notation3]);
        expect(pageInfo.hasNextPage).toBe(false);
        expect(pageInfo.hasPreviousPage).toBe(false);
        expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
        expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
      });

      it('returns notations that have a song name matching query', async () => {
        const { edges, pageInfo } = await notationRepo.findPage({ first: 3, query: 'over' });

        expect(edges).toHaveLength(1);
        expect(edges.map((edge) => edge.node)).toStrictEqual([notation2]);
        expect(pageInfo.hasNextPage).toBe(false);
        expect(pageInfo.hasPreviousPage).toBe(false);
        expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
        expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
      });

      it('returns notations that have a artist name matching query', async () => {
        const { edges, pageInfo } = await notationRepo.findPage({ first: 3, query: 'daws' });

        expect(edges).toHaveLength(1);
        expect(edges.map((edge) => edge.node)).toStrictEqual([notation3]);
        expect(pageInfo.hasNextPage).toBe(false);
        expect(pageInfo.hasPreviousPage).toBe(false);
        expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
        expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
      });

      it('returns notations that have a tagId', async () => {
        const { edges, pageInfo } = await notationRepo.findPage({ first: 3, tagIds: [tag2.id] });

        expect(edges).toHaveLength(2);
        expect(edges.map((edge) => edge.node)).toStrictEqual([notation1, notation2]);
        expect(pageInfo.hasNextPage).toBe(false);
        expect(pageInfo.hasPreviousPage).toBe(false);
        expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
      });

      it('returns notations that have all tagIds', async () => {
        const { edges, pageInfo } = await notationRepo.findPage({ first: 3, tagIds: [tag1.id, tag2.id] });

        expect(edges).toHaveLength(1);
        expect(edges.map((edge) => edge.node)).toStrictEqual([notation1]);
        expect(pageInfo.hasNextPage).toBe(false);
        expect(pageInfo.hasPreviousPage).toBe(false);
        expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
      });

      it('returns notations that have all tagIds', async () => {
        const { edges, pageInfo } = await notationRepo.findPage({ first: 3, tagIds: [tag1.id, tag2.id] });

        expect(edges).toHaveLength(1);
        expect(edges.map((edge) => edge.node)).toStrictEqual([notation1]);
        expect(pageInfo.hasNextPage).toBe(false);
        expect(pageInfo.hasPreviousPage).toBe(false);
        expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
      });
    });
  });

  describe('findSuggestions', () => {
    let db: Db;

    let transcriber: User;

    let artistName1: string;
    let artistName2: string;

    let notation1: Notation;
    let notation2: Notation;
    let notation3: Notation;
    let notation4: Notation;

    let tag1: Tag;
    let tag2: Tag;
    let tag3: Tag;

    beforeEach(async () => {
      db = container.get<Db>(TYPES.Db);

      artistName1 = randStr(10);
      artistName2 = randStr(10);

      transcriber = await userRepo.create(buildRandUser());

      [notation1, notation2, notation3, notation4] = await notationRepo.bulkCreate([
        buildRandNotation({ cursor: 1, transcriberId: transcriber.id, artistName: artistName1 }),
        buildRandNotation({ cursor: 2, transcriberId: transcriber.id, artistName: artistName1 }),
        buildRandNotation({ cursor: 3, transcriberId: transcriber.id, artistName: artistName1 }),
        buildRandNotation({ cursor: 4, transcriberId: transcriber.id, artistName: artistName2 }),
      ]);

      [tag1, tag2, tag3] = await tagRepo.bulkCreate([buildRandTag(), buildRandTag(), buildRandTag()]);
    });

    it('finds suggestions with matching tag ids', async () => {
      await taggingRepo.bulkCreate([
        buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag2.id }),
        buildRandTagging({ notationId: notation3.id, tagId: tag1.id }),
      ]);

      const suggestedNotations = await notationRepo.findSuggestions(notation1, 2);
      expect(suggestedNotations).toIncludeAllMembers([notation2, notation3]);
    });

    it('finds suggestions with matching artist name', async () => {
      const suggestedNotations = await notationRepo.findSuggestions(notation1, 2);
      expect(suggestedNotations).toIncludeAllMembers([notation2, notation3]);
    });

    it('finds suggestions without matching artist name or tag ids', async () => {
      const suggestedNotations = await notationRepo.findSuggestions(notation4, 3);
      expect(suggestedNotations).toIncludeAllMembers([notation1, notation2, notation3]);
    });

    it('sorts by num matching tag ids, then matching artists', async () => {
      await taggingRepo.bulkCreate([
        buildRandTagging({ notationId: notation1.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation1.id, tagId: tag2.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag1.id }),
        buildRandTagging({ notationId: notation2.id, tagId: tag2.id }),
        buildRandTagging({ notationId: notation3.id, tagId: tag1.id }),
      ]);

      const suggestedNotations = await notationRepo.findSuggestions(notation1, 2);
      expect(suggestedNotations).toIncludeAllMembers([notation2, notation3]);
    });

    it('finds suggestions in a random order', async () => {
      await db.query(`select setseed(0)`);
      const suggestedNotations1 = await notationRepo.findSuggestions(notation1, 4);
      expect(suggestedNotations1).toIncludeAllMembers([notation2, notation3, notation4]);

      await db.query(`select setseed(0.5)`);
      const suggestedNotations2 = await notationRepo.findSuggestions(notation1, 4);
      expect(suggestedNotations2).toIncludeAllMembers([notation2, notation3, notation4]);

      expect(suggestedNotations1).not.toStrictEqual(suggestedNotations2);
    });
  });
});
