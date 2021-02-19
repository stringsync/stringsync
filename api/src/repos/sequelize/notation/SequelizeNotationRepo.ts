import { inject, injectable } from 'inversify';
import { get } from 'lodash';
import { Db, NotationModel } from '../../../db';
import { Notation } from '../../../domain';
import { NotFoundError } from '../../../errors';
import { TYPES } from '../../../inversify.constants';
import { Connection, NotationConnectionArgs, Pager, PagingCtx, PagingType } from '../../../util';
import { findNotationPageMaxQuery, findNotationPageMinQuery, findNotationPageQuery } from '../../queries';
import { NotationLoader, NotationRepo } from '../../types';

@injectable()
export class SequelizeNotationRepo implements NotationRepo {
  static pager = new Pager<Notation>(10, 'notation');

  constructor(@inject(TYPES.NotationLoader) private notationLoader: NotationLoader, @inject(TYPES.Db) private db: Db) {}

  async findAllByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationLoader.findAllByTranscriberId(transcriberId);
  }

  async findAllByTag(tagId: string): Promise<Notation[]> {
    return await this.notationLoader.findAllByTagId(tagId);
  }

  async count(): Promise<number> {
    return await NotationModel.count();
  }

  async find(id: string): Promise<Notation | null> {
    return await this.notationLoader.findById(id);
  }

  async findAll(): Promise<Notation[]> {
    return await NotationModel.findAll({ raw: true });
  }

  async findAllByTagId(tagId: string): Promise<Notation[]> {
    return await this.notationLoader.findAllByTagId(tagId);
  }

  async create(attrs: Partial<Notation>) {
    const notationModel = await NotationModel.create(attrs, { raw: true });
    const notation = notationModel.get({ plain: true }) as Notation;
    return notation;
  }

  async bulkCreate(bulkAttrs: Partial<Notation>[]): Promise<Notation[]> {
    const notationModels: NotationModel[] = await NotationModel.bulkCreate(bulkAttrs);
    const notations = notationModels.map((notationModel) => notationModel.get({ plain: true })) as Notation[];
    return notations;
  }

  async update(id: string, attrs: Partial<Notation>): Promise<Notation> {
    const notationEntity = await NotationModel.findByPk(id);
    if (!notationEntity) {
      throw new NotFoundError('notation not found');
    }
    await notationEntity.update(attrs);
    return notationEntity.get({ plain: true });
  }

  async findPage(args: NotationConnectionArgs): Promise<Connection<Notation>> {
    const tagIds = args.tagIds || null;
    const query = args.query ? `%${args.query}%` : null;

    return await NotationSequelizeRepo.pager.connect(args, async (pagingCtx: PagingCtx) => {
      const { cursor, limit, pagingType } = pagingCtx;
      const queryArgs = { cursor, pagingType, limit, query, tagIds };

      const [entityRows, minRows, maxRows] = await Promise.all([
        this.db.query<Notation>(findNotationPageQuery(queryArgs)),
        this.db.query<number>(findNotationPageMinQuery(queryArgs)),
        this.db.query<number>(findNotationPageMaxQuery(queryArgs)),
      ]);

      const entities = entityRows;
      if (pagingType === PagingType.BACKWARD) {
        entities.reverse();
      }

      const min = get(minRows, '[0].min') || -Infinity;
      const max = get(maxRows, '[0].max') || +Infinity;

      return { entities, min, max };
    });
  }
}
