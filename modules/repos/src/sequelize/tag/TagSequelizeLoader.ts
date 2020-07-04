import { TagLoader } from '../../types';
import Dataloader from 'dataloader';
import { TYPES } from '@stringsync/container';
import { TagModel } from '@stringsync/sequelize';
import { inject, injectable } from 'inversify';
import { Tag } from '@stringsync/domain';
import { alignOneToOne } from '../../dataloader-utils';

@injectable()
export class TagSequelizeLoader implements TagLoader {
  tagModel: typeof TagModel;

  byIdLoader: Dataloader<string, Tag | null>;

  constructor(@inject(TYPES.TagModel) tagModel: typeof TagModel) {
    this.tagModel = tagModel;

    this.byIdLoader = new Dataloader(this.loadAllById);
  }

  startListeningForChanges(): void {
    this.tagModel.emitter.addListener(this.tagModel.PRIME_CACHE, this.primeById);
    this.tagModel.emitter.addListener(this.tagModel.CLEAR_CACHE, this.clearById);
  }

  stopListeningForChanges(): void {
    this.tagModel.emitter.removeListener(this.tagModel.PRIME_CACHE, this.primeById);
    this.tagModel.emitter.removeListener(this.tagModel.CLEAR_CACHE, this.clearById);
  }

  async findById(id: string): Promise<Tag | null> {
    return await this.byIdLoader.load(id);
  }

  private loadAllById = async (ids: readonly string[]): Promise<Array<Tag | null>> => {
    const tags: Tag[] = await this.tagModel.findAll({ where: { id: [...ids] } });
    return alignOneToOne([...ids], tags, {
      getKey: (tag) => tag.id,
      getUniqueIdentifier: (tag) => tag.id,
      getMissingValue: () => null,
    });
  };

  private primeById = (id: string, tag: Tag) => {
    this.byIdLoader.prime(id, tag);
  };

  private clearById = (id: string) => {
    this.byIdLoader.clear(id);
  };
}
