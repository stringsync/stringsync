import { Connection, NotationConnectionArgs, PagingType } from '@stringsync/common';
import { PagingCtx } from '../../util';
import { TYPES } from '@stringsync/container';
import { Notation } from '@stringsync/domain';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import {
  camelCaseKeys,
  findNotationPageQuery,
  findNotationPageMinQuery,
  findNotationPageMaxQuery,
} from '../../queries';
import { NotationLoader, NotationRepo } from '../../types';
import { NotationPager } from '../../pagers';
import { get } from 'lodash';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  notationModel: typeof NotationModel;
  notationLoader: NotationLoader;
  notationPager: NotationPager;
  sequelize: Sequelize;

  constructor(
    @inject(TYPES.NotationModel) notationModel: typeof NotationModel,
    @inject(TYPES.NotationLoader) notationLoader: NotationLoader,
    @inject(TYPES.NotationPager) notationPager: NotationPager,
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
      const queryArgs = { cursor, pagingType, limit, query, tagIds };

      const [entityRows, minRows, maxRows] = await Promise.all([
        this.sequelize.query(findNotationPageQuery(queryArgs), { type: QueryTypes.SELECT }),
        this.sequelize.query(findNotationPageMinQuery(queryArgs), { type: QueryTypes.SELECT }),
        this.sequelize.query(findNotationPageMaxQuery(queryArgs), { type: QueryTypes.SELECT }),
      ]);

      const entities = camelCaseKeys(entityRows) as Notation[];
      if (pagingType === PagingType.BACKWARD) {
        entities.reverse();
      }
      const min = get(minRows, '[0].min', Infinity);
      const max = get(maxRows, '[0].max', -Infinity);

      return { entities, min, max };
    });
  }
}
