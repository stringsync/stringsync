import { useTestContainer } from '@stringsync/di';
import { EntityBuilder } from '@stringsync/domain';
import { DB } from '../../DB';
import { TagModel } from './TagModel';

describe('TagModel', () => {
  useTestContainer(DB);

  it('permits valid tags', async () => {
    const tag = TagModel.build(EntityBuilder.buildRandTag());
    await expect(tag.validate()).resolves.not.toThrow();
  });
});
