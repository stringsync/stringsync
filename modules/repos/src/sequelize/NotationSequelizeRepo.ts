import { TYPES } from '@stringsync/container';
import { NotationModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { NotationRepo } from '../types';
import { Notation, User } from '@stringsync/domain';

@injectable()
export class NotationSequelizeRepo implements NotationRepo {
  readonly notationModel: typeof NotationModel;

  constructor(@inject(TYPES.NotationModel) notationModel: typeof NotationModel) {
    this.notationModel = notationModel;
  }

  async count(): Promise<number> {
    return await this.notationModel.count();
  }

  async find(id: string): Promise<Notation | null> {
    return await this.notationModel.findByPk(id, { raw: true });
  }

  async findAll(): Promise<Notation[]> {
    return this.notationModel.findAll({ raw: true });
  }

  async create(attrs: Partial<Notation>) {
    const notationModel = await this.notationModel.create(attrs, { raw: true });
    return notationModel.get({ plain: true }) as Notation;
  }

  async bulkCreate(bulkAttrs: Partial<Notation>[]): Promise<Notation[]> {
    const notationModels = await this.notationModel.bulkCreate(bulkAttrs);
    return notationModels.map((notationModel: NotationModel) => notationModel.toJSON()) as Notation[];
  }

  async update(id: string, attrs: Partial<Notation>): Promise<void> {
    await this.notationModel.update(attrs, { where: { id } });
  }
}
