import { TYPES } from '@stringsync/container';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { NotationRepo, NotationLoader } from '../../types';
import { Notation } from '@stringsync/domain';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  notationModel: typeof NotationModel;
  notationLoader: NotationLoader;

  constructor(
    @inject(TYPES.NotationModel) notationModel: typeof NotationModel,
    @inject(TYPES.NotationLoader) notationLoader: NotationLoader
  ) {
    this.notationModel = notationModel;
    this.notationLoader = notationLoader;
  }

  async findByTranscriberId(transcriberId: string): Promise<Notation[]> {
    return await this.notationLoader.findByTranscriberId(transcriberId);
  }

  async count(): Promise<number> {
    return await this.notationModel.count();
  }

  async find(id: string): Promise<Notation | null> {
    return this.notationLoader.findById(id);
  }

  async findAll(): Promise<Notation[]> {
    return this.notationModel.findAll({ raw: true });
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
}
