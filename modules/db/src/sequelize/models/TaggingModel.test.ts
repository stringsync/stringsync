import { useTestContainer, TYPES } from '@stringsync/di';
import { TaggingModel } from './TaggingModel';
import { TestFactory } from '@stringsync/common';

const container = useTestContainer();

let taggingModel: typeof TaggingModel;

beforeEach(() => {
  taggingModel = container.get<typeof TaggingModel>(TYPES.TaggingModel);
});

it('permits valid taggings', async () => {
  const tagging = taggingModel.build(TestFactory.buildRandTagging());
  await expect(tagging.validate()).resolves.not.toThrow();
});
