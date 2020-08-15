import { PagingMeta } from '../paging';
import { ConnectionArgs, PagingType, Connection, Edge, ConnectionFromArgs } from './types';
import { first, last, sortBy } from 'lodash';

export class Paging {
  static NONE_META: PagingMeta = { pagingType: PagingType.NONE };

  static meta(connectionArgs: ConnectionArgs): PagingMeta {
    const { first = 0, last = 0, after = null, before = null } = connectionArgs;
    const isForwardPaging = !!first || !!after;
    const isBackwardPaging = !!last || !!before;

    if (isForwardPaging && isBackwardPaging) {
      throw new Error('cursor-based pagination cannot be forwards AND backwards');
    }
    if ((isForwardPaging && before) || (isBackwardPaging && after)) {
      throw new Error('paging must use either first/after or last/before');
    }
    if ((typeof first === 'number' && first < 0) || (typeof last === 'number' && last < 0)) {
      throw new Error('paging limit must be positive');
    }

    if (isForwardPaging) {
      return { pagingType: PagingType.FORWARD, after, first };
    }
    if (isBackwardPaging) {
      return { pagingType: PagingType.BACKWARD, before, last };
    }
    return Paging.NONE_META;
  }

  static connectionFrom<T>(args: ConnectionFromArgs<T>): Connection<T> {
    const { entities, minDecodedCursor, maxDecodedCursor, getDecodedCursor, encodeCursor } = args;
    const sortedEntities = sortBy(entities, (entity) => getDecodedCursor(entity));
    const edges: Array<Edge<T>> = sortedEntities.map((entity) => ({
      node: entity,
      cursor: encodeCursor(getDecodedCursor(entity)),
    }));
    const decodedCursors = edges.map((edge) => edge.node).map(getDecodedCursor);

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? first(edges)!.cursor : null,
        endCursor: edges.length ? last(edges)!.cursor : null,
        hasNextPage: Math.max(...decodedCursors) < maxDecodedCursor,
        hasPreviousPage: Math.min(...decodedCursors) > minDecodedCursor,
      },
    };
  }
}
