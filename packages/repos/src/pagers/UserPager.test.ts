import { PagingType, EntityBuilder, UnknownError } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/di';
import { User } from '@stringsync/domain';
import { first, last, sortBy } from 'lodash';
import { UserPager } from './UserPager';
import { PagingCtx } from '../util';

const container = useTestContainer();

let userPager: UserPager;

beforeEach(() => {
  userPager = container.get<UserPager>(TYPES.UserPager);
});

describe('encoding', () => {
  it('can encode and decode a cursor', () => {
    const cursor = 1;

    const encodedCursor = userPager.encodeCursor(cursor);
    const decodedCursor = userPager.decodeCursor(encodedCursor);

    expect(decodedCursor).toBe(cursor);
  });
});

describe('connect', () => {
  const NUM_USERS = 15;

  let users: User[];

  beforeEach(() => {
    users = new Array<User>(NUM_USERS);
    for (let ndx = 0; ndx < NUM_USERS; ndx++) {
      users[ndx] = EntityBuilder.buildRandUser({ cursor: ndx + 1 });
    }
  });

  const findEntities = async (pagingCtx: PagingCtx) => {
    let entities: User[];

    switch (pagingCtx.pagingType) {
      case PagingType.FORWARD:
        entities = sortBy(users, (user) => user.cursor)
          .filter((user) => user.cursor > pagingCtx.cursor)
          .slice(0, pagingCtx.limit);
        break;

      case PagingType.BACKWARD:
        entities = sortBy(users, (user) => user.cursor)
          .filter((user) => user.cursor < pagingCtx.cursor)
          .slice(-pagingCtx.limit);
        break;

      default:
        throw new UnknownError();
    }

    const cursors = users.map((user) => user.cursor);
    const min = Math.min(...cursors);
    const max = Math.max(...cursors);

    return { entities, min, max };
  };

  it('defaults to forward paging', async () => {
    const { edges, pageInfo } = await userPager.connect({}, findEntities);

    expect(edges.length).toBeGreaterThan(0);
    expect(edges).toHaveLength(userPager.defaultLimit);
    expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
    expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the first N records when forward paging', async () => {
    const cursors = users.map((user) => user.cursor);
    const minCursor = Math.min(...cursors);

    const { edges, pageInfo } = await userPager.connect({ first: 1 }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBe(minCursor);
    expect(edge.cursor).toBe(userPager.encodeCursor(minCursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the last N records when backward paging', async () => {
    const cursors = users.map((user) => user.cursor);
    const maxCursor = Math.max(...cursors);

    const { edges, pageInfo } = await userPager.connect({ last: 1 }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBe(maxCursor);
    expect(edge.cursor).toBe(userPager.encodeCursor(maxCursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the first N records after a cursor', async () => {
    const connection = await userPager.connect({ first: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const after = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await userPager.connect({ first: 1, after }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBeGreaterThan(userPager.decodeCursor(after));
    expect(edge.cursor).toBe(userPager.encodeCursor(edge.node.cursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns the last N records before a cursor', async () => {
    const connection = await userPager.connect({ last: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const before = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await userPager.connect({ last: 1, before }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBeLessThan(userPager.decodeCursor(before));
    expect(edge.cursor).toBe(userPager.encodeCursor(edge.node.cursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns records in the same order regardless of paging type', async () => {
    const forwarduserConnection = await userPager.connect({ first: NUM_USERS }, findEntities);
    const backwarduserConnection = await userPager.connect({ last: NUM_USERS }, findEntities);
    expect(forwarduserConnection).toStrictEqual(backwarduserConnection);
  });

  it('returns an empty array when paging after the last record', async () => {
    const connection = await userPager.connect({ last: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const after = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await userPager.connect({ first: 1, after }, findEntities);

    expect(edges).toHaveLength(0);
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns an empty array when paging before the first record', async () => {
    const connection = await userPager.connect({ first: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const before = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await userPager.connect({ last: 1, before }, findEntities);

    expect(edges).toHaveLength(0);
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });
});
