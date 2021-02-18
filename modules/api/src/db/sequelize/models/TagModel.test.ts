import { EntityBuilder } from '../../../testing';
import { TagModel } from './TagModel';

describe('TagModel', () => {
  it('permits valid tags', async () => {
    const tag = TagModel.build(EntityBuilder.buildRandTag());
    await expect(tag.validate()).resolves.not.toThrow();
  });
});
