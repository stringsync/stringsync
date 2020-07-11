import { Connection, ConnectionArgs, Paging, PagingType } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { first, last } from 'lodash';
import { Op } from 'sequelize';
import { NotationLoader, NotationRepo } from '../../types';
import { Base64 } from '@stringsync/common';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  static CURSOR_TYPE = 'notation';
  static CURSOR_DELIMITER = ':';
  static PAGE_LIMIT = 50;

  static decodeRankCursor(cursor: string): number {
    const [cursorType, rank] = Base64.decode(cursor).split(NotationSequelizeRepo.CURSOR_DELIMITER);
    if (cursorType !== NotationSequelizeRepo.CURSOR_TYPE) {
      throw new Error(`expected cursor type '${NotationSequelizeRepo.CURSOR_TYPE}', got: ${cursorType}`);
    }
    try {
      return parseInt(rank, 10);
    } catch (e) {
      throw new Error(`cannot decode cursor: ${cursor}`);
    }
  }

  static encodeRankCursor(rank: number): string {
    const cursorType = NotationSequelizeRepo.CURSOR_TYPE;
    const cursorDelimiter = NotationSequelizeRepo.CURSOR_DELIMITER;
    return Base64.encode(`${cursorType}${cursorDelimiter}${rank}`);
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

  async findPage(connectionArgs: ConnectionArgs): Promise<Connection<Notation>> {
    const pagingMeta = Paging.meta(connectionArgs);

    switch (pagingMeta.pagingType) {
      case PagingType.NONE:
        return await this.pageNone(NotationSequelizeRepo.PAGE_LIMIT);

      case PagingType.FORWARD:
        const first = pagingMeta.first || NotationSequelizeRepo.PAGE_LIMIT;
        const after = pagingMeta.after;
        return await this.pageForward(first, after);

      case PagingType.BACKWARD:
        const last = pagingMeta.last || NotationSequelizeRepo.PAGE_LIMIT;
        const before = pagingMeta.before;
        return await this.pageBackward(last, before);

      default:
        throw new Error(`operation not supported`);
    }
  }

  private async pageNone(limit: number): Promise<Connection<Notation>> {
    const [notations, count] = await Promise.all([
      this.notationModel.findAll({ order: [['rank', 'DESC']], limit, raw: true }),
      this.count(),
    ]);
    const edges = notations.map((notation) => ({
      node: notation,
      cursor: NotationSequelizeRepo.encodeRankCursor(notation.rank),
    }));

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? first(edges)!.cursor : null,
        endCursor: edges.length ? last(edges)!.cursor : null,
        hasNextPage: edges.length < count,
        hasPreviousPage: false,
      },
    };
  }

  private async pageForward(limit: number, after: string | null): Promise<Connection<Notation>> {
    const [notation, min, max] = await Promise.all([
      this.notationModel.findAll({
        where: after ? { rank: { [Op.lt]: NotationSequelizeRepo.decodeRankCursor(after) } } : undefined,
        order: [['rank', 'DESC']],
        limit,
        raw: true,
      }),
      this.notationModel.min<NotationModel, number>('rank'),
      this.notationModel.max<NotationModel, number>('rank'),
    ]);
    const edges = notation.map((notation) => ({
      node: notation,
      cursor: NotationSequelizeRepo.encodeRankCursor(notation.rank),
      raw: true,
    }));
    const ranks = edges.map((edge) => edge.node.rank);

    return {
      edges,
      pageInfo: {
        startCursor: edges.length ? first(edges)!.cursor : null,
        endCursor: edges.length ? last(edges)!.cursor : null,
        hasNextPage: Math.max(Infinity, ...ranks) < max,
        hasPreviousPage: Math.min(-Infinity, ...ranks) > min,
      },
    };
  }

  private async pageBackward(last: number, before: string | null): Promise<Connection<Notation>> {
    throw new Error('not implemented');
  }
}
