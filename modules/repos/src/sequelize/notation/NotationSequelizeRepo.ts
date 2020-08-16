import {
  Base64,
  Connection,
  Edge,
  NotationConnectionArgs,
  Paging,
  PagingType,
  UnknownError,
  UNKNOWN_ERROR_MSG,
} from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { first, last } from 'lodash';
import { camelCaseKeys, findNotationPageQuery } from '../../queries';
import { NotationLoader, NotationRepo } from '../../types';
import { QueryTypes } from 'sequelize';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  static CURSOR_TYPE = 'notation';
  static CURSOR_DELIMITER = ':';
  static PAGE_LIMIT = 10;

  static decodeCursor(encodedCursor: string): number {
    const [cursorType, cursor] = Base64.decode(encodedCursor).split(NotationSequelizeRepo.CURSOR_DELIMITER);
    if (cursorType !== NotationSequelizeRepo.CURSOR_TYPE) {
      throw new Error(`expected cursor type '${NotationSequelizeRepo.CURSOR_TYPE}', got: ${cursorType}`);
    }
    try {
      return parseInt(cursor, 10);
    } catch (e) {
      throw new Error(`cannot decode cursor: ${cursor}`);
    }
  }

  static encodeCursor(decodedCursor: number): string {
    const cursorType = NotationSequelizeRepo.CURSOR_TYPE;
    const cursorDelimiter = NotationSequelizeRepo.CURSOR_DELIMITER;
    return Base64.encode(`${cursorType}${cursorDelimiter}${decodedCursor}`);
  }

  notationModel: typeof NotationModel;
  notationLoader: NotationLoader;

  constructor(
    @inject(TYPES.NotationModel) notationModel: typeof NotationModel,
    @inject(TYPES.NotationLoader) notationLoader: NotationLoader
  ) {
    this.notationModel = notationModel;
    this.notationLoader = notationLoader;
  }

  async findAllByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationLoader.findAllByTranscriberId(transcriberId);
  }

  async findAllByTag(tagId: string): Promise<Notation[]> {
    return await this.notationLoader.findAllByTagId(tagId);
  }

  async count(): Promise<number> {
    return await this.notationModel.count();
  }

  async find(id: string): Promise<Notation | null> {
    return await this.notationLoader.findById(id);
  }

  async findAll(): Promise<Notation[]> {
    return await this.notationModel.findAll({ raw: true });
  }

  async findAllByTagId(tagId: string): Promise<Notation[]> {
    return await this.notationLoader.findAllByTagId(tagId);
  }

  async create(attrs: Partial<Notation>) {
    const notationModel = await this.notationModel.create(attrs, { raw: true });
    const notation = notationModel.get({ plain: true }) as Notation;
    return notation;
  }

  async bulkCreate(bulkAttrs: Partial<Notation>[]): Promise<Notation[]> {
    const notationModels: NotationModel[] = await this.notationModel.bulkCreate(bulkAttrs);
    const notations = notationModels.map((notationModel) => notationModel.get({ plain: true })) as Notation[];
    return notations;
  }

  async update(id: string, attrs: Partial<Notation>): Promise<void> {
    await this.notationModel.update(attrs, { where: { id } });
  }

  async findPage(args: NotationConnectionArgs): Promise<Connection<Notation>> {
    if (!this.notationModel.sequelize) {
      throw new UnknownError(UNKNOWN_ERROR_MSG);
    }

    const getExactNotations = (
      overNotations: Notation[],
      exactLimit: number,
      exactCursor: number,
      backward: boolean
    ): Notation[] => {
      const exactNotations = new Array<Notation>();
      for (const notation of overNotations) {
        if (exactNotations.length >= exactLimit) {
          break;
        }
        if (backward ? notation.cursor < exactCursor : notation.cursor > exactCursor) {
          exactNotations.push(notation);
        }
      }
      return exactNotations;
    };

    const sequelize = this.notationModel.sequelize;
    const defaultLimit = NotationSequelizeRepo.PAGE_LIMIT;
    const tagIds = args.tagIds || null;
    const query = args.query ? `%${args.query}%` : null;
    const pagingMeta = Paging.meta(args);
    const encode = NotationSequelizeRepo.encodeCursor;
    const decode = NotationSequelizeRepo.decodeCursor;

    let exactCursor: number;
    let exactLimit: number;
    let overCursor: number;
    let overLimit: number;

    let rows: any[];
    let overNotations: Notation[];
    let exactNotations: Notation[];
    let overCursors: number[];
    let exactCursors: number[];
    let edges: Array<Edge<Notation>>;

    switch (pagingMeta.pagingType) {
      case PagingType.NONE:
        exactLimit = defaultLimit;
        exactCursor = 0;
        overLimit = exactLimit + 1;
        overCursor = exactCursor;

        rows = await sequelize.query(
          findNotationPageQuery({
            cursor: overCursor,
            cursorOrder: 'asc',
            cursorCmp: '>',
            limit: overLimit,
            query,
            tagIds,
          }),
          { type: QueryTypes.SELECT }
        );

        overNotations = camelCaseKeys(rows);
        exactNotations = getExactNotations(overNotations, exactLimit, exactCursor, false);
        overCursors = overNotations.map((notation) => notation.cursor);
        exactCursors = exactNotations.map((notation) => notation.cursor);
        edges = exactNotations.map((notation) => ({ node: notation, cursor: encode(notation.cursor) }));

        return {
          edges,
          pageInfo: {
            startCursor: edges.length ? first(edges)!.cursor : null,
            endCursor: edges.length ? last(edges)!.cursor : null,
            hasNextPage: Math.max(...overCursors) > Math.max(...exactCursors),
            hasPreviousPage: Math.min(...overCursors) < Math.min(...exactCursors),
          },
        };

      case PagingType.FORWARD:
        exactLimit = typeof pagingMeta.first === 'number' ? pagingMeta.first : defaultLimit;
        exactCursor = pagingMeta.after ? decode(pagingMeta.after) : 0;
        overLimit = exactLimit + 2;
        overCursor = exactCursor - 1;

        rows = await sequelize.query(
          findNotationPageQuery({
            cursor: overCursor,
            cursorOrder: 'asc',
            cursorCmp: '>',
            limit: overLimit,
            query,
            tagIds,
          }),
          { type: QueryTypes.SELECT }
        );

        overNotations = camelCaseKeys(rows);
        exactNotations = getExactNotations(overNotations, exactLimit, exactCursor, false);
        overCursors = overNotations.map((notation) => notation.cursor);
        exactCursors = exactNotations.map((notation) => notation.cursor);
        edges = exactNotations.map((notation) => ({ node: notation, cursor: encode(notation.cursor) }));

        return {
          edges,
          pageInfo: {
            startCursor: edges.length ? first(edges)!.cursor : null,
            endCursor: edges.length ? last(edges)!.cursor : null,
            hasNextPage: Math.max(...overCursors) > Math.max(...exactCursors),
            hasPreviousPage: Math.min(...overCursors) < Math.min(...exactCursors),
          },
        };

      case PagingType.BACKWARD:
        exactLimit = typeof pagingMeta.last === 'number' ? pagingMeta.last : defaultLimit;
        exactCursor = pagingMeta.before ? decode(pagingMeta.before) : 2147483645;
        overLimit = exactLimit + 2;
        overCursor = exactCursor + 1;
        rows = await sequelize.query(
          findNotationPageQuery({
            cursor: overCursor,
            cursorOrder: 'desc',
            cursorCmp: '<',
            limit: overLimit,
            query,
            tagIds,
          }),
          { type: QueryTypes.SELECT }
        );

        overNotations = camelCaseKeys(rows);
        exactNotations = getExactNotations(overNotations, exactLimit, exactCursor, true);
        overCursors = overNotations.map((notation) => notation.cursor);
        exactCursors = exactNotations.map((notation) => notation.cursor);
        edges = exactNotations.map((notation) => ({ node: notation, cursor: encode(notation.cursor) }));

        return {
          edges: edges.reverse(),
          pageInfo: {
            startCursor: edges.length ? first(edges)!.cursor : null,
            endCursor: edges.length ? last(edges)!.cursor : null,
            hasNextPage: Math.min(...overCursors) < Math.min(...exactCursors),
            hasPreviousPage: Math.max(...overCursors) > Math.max(...exactCursors),
          },
        };

      default:
        throw new UnknownError(UNKNOWN_ERROR_MSG);
    }
  }
}
