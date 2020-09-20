import { PagingType, UnknownError } from '@stringsync/common';
import { first, last, sortBy } from 'lodash';
import { Pager } from './Pager';
import { PagingCtx, PagingEntity } from './types';

let entityPager: Pager<PagingEntity>;

beforeEach(() => {
  entityPager = new Pager<PagingEntity>(10, 'entity');
});

describe('encoding', () => {
  it('can encode and decode a cursor', () => {
    const cursor = 1;

    const encodedCursor = entityPager.encodeCursor(cursor);
    const decodedCursor = entityPager.decodeCursor(encodedCursor);

    expect(decodedCursor).toBe(cursor);
  });
});

describe('connect', () => {
  const NUM_ENTITIES = 15;

  let allEntities: PagingEntity[];

  beforeEach(() => {
    allEntities = new Array<PagingEntity>(NUM_ENTITIES);
    for (let ndx = 0; ndx < NUM_ENTITIES; ndx++) {
      allEntities[ndx] = { cursor: ndx + 1 };
    }
  });

  const findEntities = async (pagingCtx: PagingCtx) => {
    let entities: PagingEntity[];

    switch (pagingCtx.pagingType) {
      case PagingType.FORWARD:
        entities = sortBy(allEntities, (entity) => entity.cursor)
          .filter((entity) => entity.cursor > pagingCtx.cursor)
          .slice(0, pagingCtx.limit);
        break;

      case PagingType.BACKWARD:
        entities = sortBy(allEntities, (entity) => entity.cursor)
          .filter((entity) => entity.cursor < pagingCtx.cursor)
          .slice(-pagingCtx.limit);
        break;

      default:
        throw new UnknownError();
    }

    const cursors = allEntities.map((entity) => entity.cursor);
    const min = Math.min(...cursors);
    const max = Math.max(...cursors);

    return { entities, min, max };
  };

  it('defaults to forward paging', async () => {
    const { edges, pageInfo } = await entityPager.connect({}, findEntities);

    expect(edges.length).toBeGreaterThan(0);
    expect(edges).toHaveLength(entityPager.defaultLimit);
    expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
    expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the first N records when forward paging', async () => {
    const cursors = allEntities.map((entity) => entity.cursor);
    const minCursor = Math.min(...cursors);

    const { edges, pageInfo } = await entityPager.connect({ first: 1 }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBe(minCursor);
    expect(edge.cursor).toBe(entityPager.encodeCursor(minCursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the last N records when backward paging', async () => {
    const cursors = allEntities.map((entity) => entity.cursor);
    const maxCursor = Math.max(...cursors);

    const { edges, pageInfo } = await entityPager.connect({ last: 1 }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBe(maxCursor);
    expect(edge.cursor).toBe(entityPager.encodeCursor(maxCursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the first N records after a cursor', async () => {
    const connection = await entityPager.connect({ first: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const after = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await entityPager.connect({ first: 1, after }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBeGreaterThan(entityPager.decodeCursor(after));
    expect(edge.cursor).toBe(entityPager.encodeCursor(edge.node.cursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns the last N records before a cursor', async () => {
    const connection = await entityPager.connect({ last: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const before = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await entityPager.connect({ last: 1, before }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBeLessThan(entityPager.decodeCursor(before));
    expect(edge.cursor).toBe(entityPager.encodeCursor(edge.node.cursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns records in the same order regardless of paging type', async () => {
    const forwardEntityConnection = await entityPager.connect({ first: NUM_ENTITIES }, findEntities);
    const backwardEntityConnection = await entityPager.connect({ last: NUM_ENTITIES }, findEntities);
    expect(forwardEntityConnection).toStrictEqual(backwardEntityConnection);
  });

  it('returns an empty array when paging after the last record', async () => {
    const connection = await entityPager.connect({ last: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const after = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await entityPager.connect({ first: 1, after }, findEntities);

    expect(edges).toHaveLength(0);
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns an empty array when paging before the first record', async () => {
    const connection = await entityPager.connect({ first: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const before = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await entityPager.connect({ last: 1, before }, findEntities);

    expect(edges).toHaveLength(0);
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });
});
