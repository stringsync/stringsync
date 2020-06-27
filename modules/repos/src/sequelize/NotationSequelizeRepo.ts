import { TYPES } from '@stringsync/container';
import { NotationModel } from '@stringsync/sequelize';
import { inject } from 'inversify';
import { NotationRepo } from '../types';
import { Notation } from '@stringsync/domain';

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
    return await this.notationModel.create(attrs, { raw: true });
  }

  async bulkCreate(bulkAttrs: Partial<Notation>[]): Promise<Notation[]> {
    return this.notationModel.bulkCreate(bulkAttrs);
  }

  async update(id: string, attrs: Partial<Notation>): Promise<void> {
    await this.notationModel.update(attrs, { where: { id } });
  }
}
