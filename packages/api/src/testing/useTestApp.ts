import { useTestContainer } from '@stringsync/di';
import { API } from '../API';
import { app } from '../app';
import { generateSchema } from '../schema';
import { TestAppRef } from './types';

export const useTestApp = (): TestAppRef => {
  const ref: Partial<TestAppRef> = {};
  const schema = generateSchema();
  const testContainerRef = useTestContainer(API);

  beforeAll(() => {
    ref.schema = schema;
    ref.container = testContainerRef.container;
    ref.app = app(testContainerRef.container, schema);
  });

  return ref as TestAppRef;
};
