import { first, last } from 'lodash';
import { InternalError, UnknownError } from '../../errors';
import { Base64 } from '../base64';
import {
  Connection,
  ConnectionArgs,
  Edge,
  EntityFinder,
  EntityFinderResults,
  PageInfo,
  PagingCtx,
  PagingEntity,
  PagingMeta,
  PagingType,
} from './types';

export class Pager<T extends PagingEntity> {
  static DEFAULT_FORWARD_CURSOR = 0;
  static DEFAULT_BACKWARD_CURSOR = 2147483645;
  static CURSOR_DELIMITER = ':';

  static meta(connectionArgs: ConnectionArgs): PagingMeta {
    const { first = null, last = null, after = null, before = null } = connectionArgs;
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

  readonly defaultLimit: number;
  readonly cursorType: string;

  constructor(defaultLimit: number, cursorType: string) {
    this.defaultLimit = defaultLimit;
    this.cursorType = cursorType;
  }

  decodeCursor(encodedCursor: string): number {
    const [cursorType, cursor] = Base64.decode(encodedCursor).split(Pager.CURSOR_DELIMITER);
    if (cursorType !== this.cursorType) {
      throw new Error(`expected cursor type '${this.cursorType}', got: ${cursorType}`);
    }
    try {
      return parseInt(cursor, 10);
    } catch (e) {
      throw new Error(`cannot decode cursor: ${cursor}`);
    }
  }

  encodeCursor(decodedCursor: number): string {
    return Base64.encode(`${this.cursorType}${Pager.CURSOR_DELIMITER}${decodedCursor}`);
  }

  async connect(connectionArgs: ConnectionArgs, findEntities: EntityFinder<T>): Promise<Connection<T>> {
    const pagingCtx = this.getPagingCtx(connectionArgs);
    let results = await findEntities(pagingCtx);
    results = this.sanitizeNaNs(results);
    this.validate(results, pagingCtx);

    const edges = this.getEdges(results);
    const pageInfo = this.getPageInfo(results, pagingCtx);

    return { edges, pageInfo };
  }

  private getPagingCtx(connectionArgs: ConnectionArgs): PagingCtx {
    const pagingMeta = Pager.meta(connectionArgs);

    switch (pagingMeta.pagingType) {
      case PagingType.FORWARD:
        return {
          cursor: pagingMeta.after ? this.decodeCursor(pagingMeta.after) : Pager.DEFAULT_FORWARD_CURSOR,
          limit: typeof pagingMeta.first === 'number' ? pagingMeta.first : this.defaultLimit,
          pagingType: pagingMeta.pagingType,
        };

      case PagingType.BACKWARD:
        return {
          cursor: pagingMeta.before ? this.decodeCursor(pagingMeta.before) : Pager.DEFAULT_BACKWARD_CURSOR,
          limit: typeof pagingMeta.last === 'number' ? pagingMeta.last : this.defaultLimit,
          pagingType: pagingMeta.pagingType,
        };

      default:
        throw new UnknownError();
    }
  }

  private sanitizeNaNs(results: EntityFinderResults<T>): EntityFinderResults<T> {
    return {
      ...results,
      min: isNaN(results.min) ? -Infinity : results.min,
      max: isNaN(results.max) ? +Infinity : results.max,
    };
  }

  private validate(results: EntityFinderResults<T>, pagingCtx: PagingCtx): void {
    const { cursor, limit, pagingType } = pagingCtx;
    const { entities, min, max } = results;

    if (typeof min !== 'number') {
      throw new InternalError('min must be a number');
    }

    if (typeof max !== 'number') {
      throw new InternalError('max must be a number');
    }

    if (entities.length > limit) {
      throw new InternalError('too many entities returned');
    }

    for (let ndx = 0; ndx < entities.length - 1; ndx++) {
      const [curr, next] = entities.slice(ndx, ndx + 2);
      if (curr.cursor > next.cursor) {
        throw new InternalError('entities must be sorted in ascending cursors');
      }
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
        throw new UnknownError();
    }
  }

  private getEdges(results: EntityFinderResults<T>): Array<Edge<T>> {
    return results.entities.map((entity) => ({ node: entity, cursor: this.encodeCursor(entity.cursor) }));
  }

  private getPageInfo(results: EntityFinderResults<T>, pagingCtx: PagingCtx): PageInfo {
    const { cursor, pagingType } = pagingCtx;
    const { entities, min, max } = results;

    let hasNextPage: boolean;
    let hasPreviousPage: boolean;
    const cursors = entities.map((entity) => entity.cursor);
    switch (pagingType) {
      case PagingType.FORWARD:
        hasNextPage = Boolean(cursors.length) && max > Math.max(...cursors);
        hasPreviousPage = cursor >= min && min < Math.min(...cursors);
        break;

      case PagingType.BACKWARD:
        hasNextPage = Boolean(cursors.length) && min < Math.min(...cursors);
        hasPreviousPage = cursor <= max && max > Math.max(...cursors);
        break;

      default:
        throw new UnknownError();
    }

    const startCursor = entities.length ? this.encodeCursor(first(entities)!.cursor) : null;
    const endCursor = entities.length ? this.encodeCursor(last(entities)!.cursor) : null;

    return { startCursor, endCursor, hasNextPage, hasPreviousPage };
  }
}
