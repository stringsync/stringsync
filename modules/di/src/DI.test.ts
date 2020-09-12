import { TYPES } from '@stringsync/di';
import { useTestContainer } from './useTestContainer';

const container = useTestContainer();

it.each(Object.values(TYPES))('returns an instance for identifier', (identifier) => {
  const object = container.get(identifier);
  expect(object).toBeDefined();
});
