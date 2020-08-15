import {
  Base64,
  Connection,
  NotationConnectionArgs,
  Paging,
  PagingType,
  BadRequestError,
  PagingMeta,
} from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { Op, FindOptions } from 'sequelize';
import { NotationLoader, NotationRepo } from '../../types';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  static CURSOR_TYPE = 'notation';
  static CURSOR_DELIMITER = ':';
  static PAGE_LIMIT = 50;

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
    const pagingMeta = Paging.meta(args);
    const findOptions = this.getFindOptions(pagingMeta);
    const [notations, min, max] = await Promise.all([
      this.notationModel.findAll(findOptions),
      this.notationModel.min<NotationModel, number>('cursor'),
      this.notationModel.max<NotationModel, number>('cursor'),
    ]);

    return Paging.connectionFrom<Notation>({
      entities: notations,
      minDecodedCursor: min,
      maxDecodedCursor: max,
      getDecodedCursor: (notation) => notation.cursor,
      encodeCursor: NotationSequelizeRepo.encodeCursor,
    });
  }

  private getFindOptions(pagingMeta: PagingMeta): FindOptions {
    const findOptions: FindOptions = { raw: true };

    switch (pagingMeta.pagingType) {
      case PagingType.NONE:
        findOptions.order = [['cursor', 'ASC']];
        findOptions.limit = NotationSequelizeRepo.PAGE_LIMIT;
        break;

      case PagingType.FORWARD:
        const { after } = pagingMeta;
        findOptions.where = after ? { cursor: { [Op.gt]: NotationSequelizeRepo.decodeCursor(after) } } : undefined;
        findOptions.order = [['cursor', 'ASC']];
        findOptions.limit = pagingMeta.first || NotationSequelizeRepo.PAGE_LIMIT;
        break;

      case PagingType.BACKWARD:
        const { before } = pagingMeta;
        findOptions.where = before ? { cursor: { [Op.lt]: NotationSequelizeRepo.decodeCursor(before) } } : undefined;
        findOptions.order = [['cursor', 'DESC']];
        findOptions.limit = pagingMeta.last || NotationSequelizeRepo.PAGE_LIMIT;
        break;

      default:
        throw new BadRequestError('operation not supported');
    }

    return findOptions;
  }
}
