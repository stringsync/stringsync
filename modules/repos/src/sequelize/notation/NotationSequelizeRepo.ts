import { Connection, NotationConnectionArgs, PagingCtx, PagingType } from '@stringsync/common';
import { Pager } from '../../util';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { camelCaseKeys, findNotationPageQuery } from '../../queries';
import { NotationLoader, NotationRepo } from '../../types';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  notationModel: typeof NotationModel;
  notationLoader: NotationLoader;
  notationPager: Pager<Notation>;
  sequelize: Sequelize;

  constructor(
    @inject(TYPES.NotationModel) notationModel: typeof NotationModel,
    @inject(TYPES.NotationLoader) notationLoader: NotationLoader,
    @inject(TYPES.NotationPager) notationPager: Pager<Notation>,
    @inject(TYPES.Sequelize) sequelize: Sequelize
  ) {
    this.notationModel = notationModel;
    this.notationLoader = notationLoader;
    this.notationPager = notationPager;
    this.sequelize = sequelize;
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
    const tagIds = args.tagIds || null;
    const query = args.query ? `%${args.query}%` : null;

    return this.notationPager.connect(args, async (pagingCtx: PagingCtx) => {
      const { cursor, limit, pagingType } = pagingCtx;

      const rows = await this.sequelize.query(findNotationPageQuery({ cursor, pagingType, limit, query, tagIds }), {
        type: QueryTypes.SELECT,
      });

      const notations = camelCaseKeys(rows) as Notation[];

      return pagingType === PagingType.BACKWARD ? notations.reverse() : notations;
    });
  }
}
