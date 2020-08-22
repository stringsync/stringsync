import { PagingType, TestFactory, UnknownError } from '@stringsync/common';
import { TYPES, useTestContainer } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { first, last, sortBy } from 'lodash';
import { NotationPager } from './NotationPager';
import { PagingCtx } from '../util';

const container = useTestContainer();

let notationPager: NotationPager;

beforeEach(() => {
  notationPager = container.get<NotationPager>(TYPES.NotationPager);
});

describe('encoding', () => {
  it('can encode and decode a cursor', () => {
    const cursor = 1;

    const encodedCursor = notationPager.encodeCursor(cursor);
    const decodedCursor = notationPager.decodeCursor(encodedCursor);

    expect(decodedCursor).toBe(cursor);
  });
});

describe.only('connect', () => {
  const NUM_NOTATIONS = 15;

  const notations = new Array<Notation>(NUM_NOTATIONS);

  beforeEach(() => {
    for (let ndx = 0; ndx < NUM_NOTATIONS; ndx++) {
      notations[ndx] = TestFactory.buildRandNotation({ cursor: ndx + 1 });
    }
  });

  const findEntities = async (pagingCtx: PagingCtx) => {
    let entities: Notation[];

    switch (pagingCtx.pagingType) {
      case PagingType.FORWARD:
        entities = sortBy(notations, (notation) => notation.cursor)
          .filter((notation) => notation.cursor > pagingCtx.cursor)
          .slice(0, pagingCtx.limit);
        break;

      case PagingType.BACKWARD:
        entities = sortBy(notations, (notation) => notation.cursor)
          .filter((notation) => notation.cursor < pagingCtx.cursor)
          .slice(-pagingCtx.limit);
        break;

      default:
        throw new UnknownError();
    }

    const cursors = notations.map((notation) => notation.cursor);
    const min = Math.min(...cursors);
    const max = Math.max(...cursors);

    return { entities, min, max };
  };

  it('defaults to forward paging', async () => {
    const { edges, pageInfo } = await notationPager.connect({}, findEntities);

    expect(edges.length).toBeGreaterThan(0);
    expect(edges).toHaveLength(notationPager.defaultLimit);
    expect(pageInfo.startCursor).toBe(first(edges)!.cursor);
    expect(pageInfo.endCursor).toBe(last(edges)!.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the first N records when forward paging', async () => {
    const cursors = notations.map((notation) => notation.cursor);
    const minCursor = Math.min(...cursors);

    const { edges, pageInfo } = await notationPager.connect({ first: 1 }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBe(minCursor);
    expect(edge.cursor).toBe(notationPager.encodeCursor(minCursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the last N records when backward paging', async () => {
    const cursors = notations.map((notation) => notation.cursor);
    const maxCursor = Math.max(...cursors);

    const { edges, pageInfo } = await notationPager.connect({ last: 1 }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBe(maxCursor);
    expect(edge.cursor).toBe(notationPager.encodeCursor(maxCursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(false);
  });

  it('returns the first N records after a cursor', async () => {
    const connection = await notationPager.connect({ first: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const after = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await notationPager.connect({ first: 1, after }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBeGreaterThan(notationPager.decodeCursor(after));
    expect(edge.cursor).toBe(notationPager.encodeCursor(edge.node.cursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns the first N records before a cursor', async () => {
    const connection = await notationPager.connect({ last: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const before = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await notationPager.connect({ last: 1, before }, findEntities);

    expect(edges).toHaveLength(1);
    const edge = edges[0];
    expect(edge.node.cursor).toBeLessThan(notationPager.decodeCursor(before));
    expect(edge.cursor).toBe(notationPager.encodeCursor(edge.node.cursor));
    expect(pageInfo.startCursor).toBe(edge.cursor);
    expect(pageInfo.endCursor).toBe(edge.cursor);
    expect(pageInfo.hasNextPage).toBe(true);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns records in the same order regardless of paging type', async () => {
    const forwardNotationConnection = await notationPager.connect({ first: NUM_NOTATIONS }, findEntities);
    const backwardNotationConnection = await notationPager.connect({ last: NUM_NOTATIONS }, findEntities);
    expect(forwardNotationConnection).toStrictEqual(backwardNotationConnection);
  });

  it('returns an empty array when paging after the last record', async () => {
    const connection = await notationPager.connect({ last: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const after = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await notationPager.connect({ first: 1, after }, findEntities);

    expect(edges).toHaveLength(0);
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });

  it('returns an empty array when paging before the first record', async () => {
    const connection = await notationPager.connect({ first: 1 }, findEntities);
    expect(connection.pageInfo.startCursor).not.toBeNull();
    const before = connection.pageInfo.startCursor!;

    const { edges, pageInfo } = await notationPager.connect({ last: 1, before }, findEntities);

    expect(edges).toHaveLength(0);
    expect(pageInfo.startCursor).toBeNull();
    expect(pageInfo.endCursor).toBeNull();
    expect(pageInfo.hasNextPage).toBe(false);
    expect(pageInfo.hasPreviousPage).toBe(true);
  });
});
