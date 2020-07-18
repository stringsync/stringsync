import { useTestContainer, TYPES } from '@stringsync/container';
import { TagModel } from './TagModel';
import { TestFactory } from '@stringsync/common';

const container = useTestContainer();

let tagModel: typeof TagModel;

beforeEach(() => {
  tagModel = container.get<typeof TagModel>(TYPES.TagModel);
});

it('permits valid tags', async () => {
  const tag = tagModel.build(TestFactory.buildRandTag());
  await expect(tag.validate()).resolves.not.toThrow();
});
