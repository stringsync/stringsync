import { TestFactory, randStr } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/container';
import { User, Notation } from '@stringsync/domain';
import { UserSequelizeRepo } from '@stringsync/repos';
import { isPlainObject, sortBy, take } from 'lodash';
import { NotationSequelizeRepo } from './NotationSequelizeRepo';

const container = useTestContainer();

let notationRepo: NotationSequelizeRepo;
let userRepo: UserSequelizeRepo;

let user: User;
let transcriberId: string;

beforeEach(async () => {
  notationRepo = container.get<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo);
  userRepo = container.get<UserSequelizeRepo>(TYPES.UserSequelizeRepo);

  user = await userRepo.create(TestFactory.buildRandUser());
  transcriberId = user.id;
});

describe('count', () => {
  it('counts the number of notations', async () => {
    await notationRepo.bulkCreate([
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
    ]);

    const count = await notationRepo.count();

    expect(count).toBe(3);
  });
});

describe('find', () => {
  it('finds notations', async () => {
    const { id } = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId }));
    const notation = await notationRepo.find(id);

    expect(notation).not.toBeNull();
  });

  it('returns null if notation is missing', async () => {
    const notation = await notationRepo.find(randStr(8));

    expect(notation).toBeNull();
  });

  it('returns a plain object', async () => {
    const { id } = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId }));
    const notation = await notationRepo.find(id);

    expect(isPlainObject(notation)).toBe(true);
  });
});

describe('findAll', () => {
  it('finds all notations', async () => {
    const notations = await notationRepo.bulkCreate([
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
    ]);

    const foundNotations = await notationRepo.findAll();

    expect(sortBy(foundNotations, 'id')).toStrictEqual(sortBy(notations, 'id'));
  });

  it('returns plain objects', async () => {
    const notations = await notationRepo.bulkCreate([
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
    ]);

    const foundNotations = await notationRepo.findAll();

    expect(foundNotations.every(isPlainObject)).toBe(true);
  });
});

describe('create', () => {
  it('creates a notation', async () => {
    const beforeCount = await notationRepo.count();
    await notationRepo.create(TestFactory.buildRandNotation({ transcriberId }));
    const afterCount = await notationRepo.count();

    expect(afterCount).toBe(beforeCount + 1);
  });

  it('creates a queryable notation', async () => {
    const notation = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId }));
    const foundNotation = await notationRepo.find(notation.id);

    expect(foundNotation).toStrictEqual(notation);
  });

  it('returns a plain object', async () => {
    const notation = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId }));
    const foundNotation = await notationRepo.find(notation.id);

    expect(isPlainObject(foundNotation)).toBe(true);
  });

  it('disallows duplicate ids', async () => {
    const notation = TestFactory.buildRandNotation({ transcriberId });

    await expect(notationRepo.create(notation)).resolves.not.toThrow();
    await expect(notationRepo.create(notation)).rejects.toThrow();
  });
});

describe('bulkCreate', () => {
  it('creates many notations', async () => {
    const notations = await notationRepo.bulkCreate([
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
    ]);

    const foundNotations = await notationRepo.findAll();

    expect(sortBy(foundNotations, 'id')).toStrictEqual(sortBy(notations, 'id'));
  });

  it('returns plain objects', async () => {
    const notations = await notationRepo.bulkCreate([
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
      TestFactory.buildRandNotation({ transcriberId }),
    ]);

    expect(notations.every(isPlainObject)).toBe(true);
  });
});

describe('update', () => {
  it('updates a notation', async () => {
    const notation = await notationRepo.create(TestFactory.buildRandNotation({ transcriberId }));
    const songName = randStr(8);

    await notationRepo.update(notation.id, { songName });

    const foundNotation = await notationRepo.find(notation.id);
    expect(foundNotation).not.toBeNull();
    expect(foundNotation!.songName).toBe(songName);
  });
});

describe('findPage', () => {
  const NUM_USERS = 2;
  const NUM_NOTATIONS = NotationSequelizeRepo.PAGE_LIMIT + 1;

  let users: User[];
  let notations: Notation[];

  beforeEach(async () => {
    users = new Array(NUM_USERS);
    for (let ndx = 0; ndx < NUM_USERS; ndx++) {
      users[ndx] = TestFactory.buildRandUser({ rank: ndx + 1 });
    }
    users = await userRepo.bulkCreate(users);

    notations = new Array(NUM_NOTATIONS);
    for (let ndx = 0; ndx < NUM_NOTATIONS; ndx++) {
      const transcriber = ndx % 2 === 0 ? users[0] : users[1];
      notations[ndx] = TestFactory.buildRandNotation({ rank: ndx + 1, transcriberId: transcriber.id });
    }
    notations = await notationRepo.bulkCreate(notations);
  });

  it('returns the first PAGE_LIMIT records by default', async () => {
    const notationConnection = await notationRepo.findPage({});

    const actualNotations = notationConnection.edges.map((edge) => edge.node);
    const expectedNotations = take(sortBy(notations, 'rank').reverse(), NotationSequelizeRepo.PAGE_LIMIT);

    expect(actualNotations).toHaveLength(NotationSequelizeRepo.PAGE_LIMIT);
    expect(sortBy(actualNotations, 'id')).toStrictEqual(sortBy(expectedNotations, 'id'));
  });

  it('returns the first N records by reverse rank', async () => {
    const notationConnection = await notationRepo.findPage({ first: 5 });

    const actualNotations = notationConnection.edges.map((edge) => edge.node);
    const expectedNotations = take(sortBy(notations, 'rank').reverse(), 5);

    expect(actualNotations).toHaveLength(5);
    expect(actualNotations).toStrictEqual(expectedNotations);
  });

  it('returns the first N records after a cursor', async () => {
    const { pageInfo } = await notationRepo.findPage({ first: 1 });
    const notationConnection = await notationRepo.findPage({ first: 2, after: pageInfo.endCursor });

    const actualNotations = notationConnection.edges.map((edge) => edge.node);
    const expectedNotations = take(
      sortBy(notations, 'rank')
        .reverse()
        .slice(1),
      2
    );

    expect(actualNotations).toHaveLength(2);
    expect(actualNotations).toStrictEqual(expectedNotations);
  });

  it('returns all records when limit is greater than the records', async () => {
    const limit = NUM_NOTATIONS + 1;
    const notationConnection = await notationRepo.findPage({ first: limit });

    const actualNotations = notationConnection.edges.map((edge) => edge.node);
    const expectedNotations = sortBy(notations, 'rank').reverse();

    expect(actualNotations).toStrictEqual(expectedNotations);
  });

  it('returns all records when limit is greater than remaining records after a cursor', async () => {
    const { pageInfo } = await notationRepo.findPage({ first: 1 });
    const notationConnection = await notationRepo.findPage({ first: NUM_NOTATIONS + 1, after: pageInfo.endCursor });

    const actualNotations = notationConnection.edges.map((edge) => edge.node);
    const expectedNotations = sortBy(notations)
      .reverse()
      .slice(1);

    expect(actualNotations).toHaveLength(expectedNotations.length);
    expect(actualNotations).toStrictEqual(expectedNotations);
  });

  it('does not allow backwards pagination', async () => {
    await expect(notationRepo.findPage({ last: 1 })).rejects.toThrow();
  });
});
