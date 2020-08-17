import { first, last } from 'lodash';
import { InternalError, UnknownError, UNKNOWN_ERROR_MSG } from '../errors';
import { PagingMeta } from '../pager';
import { Connection, ConnectionArgs, Edge, PageFinder, PageInfo, PagingCtx, PagingEntity, PagingType } from './types';
import { injectable } from 'inversify';

type FetchCtx = {
  exact: PagingCtx;
  over: PagingCtx;
};

@injectable()
export abstract class Pager<T extends PagingEntity> {
  static DEFAULT_FORWARD_CURSOR = 0;
  static DEFAULT_BACKWARD_CURSOR = 2147483645;

  static meta(connectionArgs: ConnectionArgs): PagingMeta {
    const { first = 0, last = 0, after = null, before = null } = connectionArgs;
    const isForwardPaging = !!first || !!after;
    const isBackwardPaging = !!last || !!before;

    if (isForwardPaging && isBackwardPaging) {
      throw new Error('cursor-based pagination cannot be forwards and backwards');
    }
    if ((isForwardPaging && before) || (isBackwardPaging && after)) {
      throw new Error('paging must use either first/after or last/before');
    }
    if ((typeof first === 'number' && first < 0) || (typeof last === 'number' && last < 0)) {
      throw new Error('paging limit must be positive');
    }

    if (isBackwardPaging) {
      return { pagingType: PagingType.BACKWARD, before, last };
    }
    return { pagingType: PagingType.FORWARD, after, first };
  }

  abstract defaultLimit: number;

  abstract encodeCursor(decodedCursor: number): string;

  abstract decodeCursor(encodedCursor: string): number;

  async connect(connectionArgs: ConnectionArgs, findPage: PageFinder<T>): Promise<Connection<T>> {
    const pagingMeta = Pager.meta(connectionArgs);
    const fetchCtx = this.getFetchCtx(pagingMeta);

    const overFetchEntities = await findPage(fetchCtx.over);
    this.validate(fetchCtx.over, overFetchEntities);

    const exactFetchEntities = this.getExactFetchEntities(fetchCtx, overFetchEntities);
    this.validate(fetchCtx.exact, exactFetchEntities);

    const edges = this.getEdges(exactFetchEntities);
    const pageInfo = this.getPageInfo(fetchCtx, overFetchEntities, exactFetchEntities);

    return { edges, pageInfo };
  }

  private getFetchCtx(pagingMeta: PagingMeta): FetchCtx {
    let exactFetchLimit: number;
    let exactFetchCursor: number;
    let overFetchLimit: number;
    let overFetchCursor: number;

    switch (pagingMeta.pagingType) {
      case PagingType.FORWARD:
        exactFetchLimit = pagingMeta.first || this.defaultLimit;
        exactFetchCursor = pagingMeta.after ? this.decodeCursor(pagingMeta.after) : Pager.DEFAULT_FORWARD_CURSOR;
        overFetchLimit = exactFetchLimit + 2;
        overFetchCursor = exactFetchCursor - 1;
        break;

      case PagingType.BACKWARD:
        exactFetchLimit = pagingMeta.last || this.defaultLimit;
        exactFetchCursor = pagingMeta.before ? this.decodeCursor(pagingMeta.before) : Pager.DEFAULT_BACKWARD_CURSOR;
        overFetchLimit = exactFetchLimit + 2;
        overFetchCursor = exactFetchCursor + 1;
        break;
      default:
        throw new UnknownError(UNKNOWN_ERROR_MSG);
    }

    return {
      exact: {
        limit: exactFetchLimit,
        cursor: exactFetchCursor,
        pagingType: pagingMeta.pagingType,
      },
      over: {
        limit: overFetchLimit,
        cursor: overFetchCursor,
        pagingType: pagingMeta.pagingType,
      },
    };
  }

  private validate(pagingCtx: PagingCtx, entities: T[]): void {
    const { cursor, limit, pagingType } = pagingCtx;
    if (entities.length > limit) {
      throw new InternalError('too many entities returned');
    }
    switch (pagingType) {
      case PagingType.FORWARD:
        if (entities.some((entity) => entity.cursor < cursor)) {
          throw new InternalError('entity returned with cursor outside of context');
        }
        break;

      case PagingType.BACKWARD:
        if (entities.some((entity) => entity.cursor > cursor)) {
          throw new InternalError('entity returned with cursor outside of context');
        }
        break;

      default:
        throw new UnknownError(UNKNOWN_ERROR_MSG);
    }
  }

  private getExactFetchEntities(fetchCtx: FetchCtx, overFetchEntities: T[]): T[] {
    switch (fetchCtx.exact.pagingType) {
      case PagingType.FORWARD:
        return overFetchEntities
          .filter((notation) => notation.cursor > fetchCtx.exact.cursor)
          .slice(0, fetchCtx.exact.limit);
      case PagingType.BACKWARD:
        return overFetchEntities
          .filter((notation) => notation.cursor < fetchCtx.exact.cursor)
          .slice(-fetchCtx.exact.limit);
      default:
        throw new UnknownError(UNKNOWN_ERROR_MSG);
    }
  }

  private getEdges(exactFetchEntities: T[]): Array<Edge<T>> {
    return exactFetchEntities.map((entity) => ({ node: entity, cursor: this.encodeCursor(entity.cursor) }));
  }

  private getPageInfo(fetchCtx: FetchCtx, overFetchEntities: T[], exactFetchEntities: T[]): PageInfo {
    if (exactFetchEntities.length > overFetchEntities.length) {
      throw new InternalError('exact entities must be smaller than over fetched entities');
    }

    const startCursor = exactFetchEntities.length ? this.encodeCursor(first(exactFetchEntities)!.cursor) : null;
    const endCursor = exactFetchEntities.length ? this.encodeCursor(last(exactFetchEntities)!.cursor) : null;

    const overFetchCursors = overFetchEntities.map((entity) => entity.cursor);
    const exactFetchCursors = exactFetchEntities.map((entity) => entity.cursor);

    let hasNextPage: boolean;
    let hasPreviousPage: boolean;
    switch (fetchCtx.exact.pagingType) {
      case PagingType.FORWARD:
        hasNextPage = Math.max(...overFetchCursors) > Math.max(...exactFetchCursors);
        hasPreviousPage = Math.min(...overFetchCursors) < Math.min(...exactFetchCursors);
        break;
      case PagingType.BACKWARD:
        hasNextPage = Math.min(...overFetchCursors) < Math.min(...exactFetchCursors);
        hasPreviousPage = Math.max(...overFetchCursors) > Math.max(...exactFetchCursors);
        break;
      default:
        throw new UnknownError(UNKNOWN_ERROR_MSG);
    }

    return { startCursor, endCursor, hasNextPage, hasPreviousPage };
  }
}
